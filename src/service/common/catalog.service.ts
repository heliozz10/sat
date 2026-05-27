import { Injectable, Query } from "@nestjs/common";
import { SupabaseClientService } from "./supabase-client.service";
import { RestaurantView } from "../../view/restaurant.view";
import { MeiliSearchClientService } from "./meilisearch-client.service";
import { MeiliSearch } from "meilisearch";
import { RestaurantService } from "../restaurant/restaurant.service";
import { OfferService } from "../restaurant/offer.service";
import * as math from "../../util/math.util";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Restaurant } from "../../entity/Restaurant";
import { RestaurantDetailedView } from "../../view/restaurant.detailed-view";
import { ActiveOffer } from "../../entity/ActiveOffer";
import { RedisClientService } from "./redis-client.service";

@Injectable()
export class CatalogService {
    private supabase;
    private meiliSearch: MeiliSearch;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        private readonly redisClientService: RedisClientService,
        private readonly meiliSearchClientService: MeiliSearchClientService,
        @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
        @InjectRepository(ActiveOffer) private readonly offerRepository: Repository<ActiveOffer>
    ) {
        this.supabase = this.supabaseClientService.client;
        this.meiliSearch = this.meiliSearchClientService.client;
    }

    async getRestaurants(params: RestaurantGetParams) {
        const { data, error } = await this.supabase.rpc("get_filtered_restaurants", {
            client_lat: params.lat,
            client_lon: params.lon,
            filter_modes: params.filterModes,
            sort_mode: params.sortMode,
            page: params.page,
            per_page: params.perPage
        });

        if(error) {
            throw error;
        }

        return data.map(d => {
            const view = new RestaurantView();
            
            view.id = d.id;
            view.name = d.name;
            view.photoUrl = d.photo_url;
            view.address = d.address;
            view.location = {
                latitude: d.location.coordinates[1],
                longitude: d.location.coordinates[0]
            };
            view.averageRating = d.average_rating;

            return view;
        });
    }

    async globalSearch({ query, userLat, userLon, page, perPage }: SearchParams) {
        const offset = (page - 1) * perPage;
        const MAX_DISTANCE_METERS = 20000;
        const useGeo = typeof userLat === 'number' && typeof userLon === 'number';

        let combined;
        if (useGeo) {
            const [nearbyRestaurants, nearbyOffers] = await Promise.all([
                this.redisClientService.cacheOrFetch(
                    this.getNearbyRestaurantsRedisKey(userLat, userLon, MAX_DISTANCE_METERS),
                    3 * 60,
                    () => this.queryNearbyRestaurants(userLat, userLon, MAX_DISTANCE_METERS)
                ),
                this.redisClientService.cacheOrFetch(
                    this.getNearbyOffersRedisKey(userLat, userLon, MAX_DISTANCE_METERS),
                    3 * 60,
                    () => this.queryNearbyOffers(userLat, userLon, MAX_DISTANCE_METERS)
                )
            ]);

            combined = [...nearbyRestaurants, ...nearbyOffers]
                .map(row => ({
                    id: row.id,
                    type: row.type,
                    distance: parseFloat(row.distance),
                }))
                .sort((a, b) => a.distance - b.distance);
        } else {
            combined = (await Promise.all([
                this.meiliSearch.index(RestaurantService.MEILISEARCH_INDEX_NAME).search(query, { limit: perPage, page }),
                this.meiliSearch.index(OfferService.MEILISEARCH_INDEX_NAME).search(query, { limit: perPage, page })
            ])).flatMap(res => res.hits.map(hit => ({ ...hit, type: hit.type === 'restaurant' ? 'restaurant' : 'offer', distance: null })));
        }

        if (!useGeo) {
            return combined.slice(0, perPage);
        }

        const paginated = combined.slice(offset, offset + perPage);
        const idsByType = {
            restaurant: paginated.filter(r => r.type === 'restaurant').map(r => r.id),
            offer: paginated.filter(r => r.type === 'offer').map(r => r.id)
        };

        const results = await Promise.all(
            Object.entries(idsByType).map(([type, ids]) =>
                ids.length
                    ? this.meiliSearch.index(type === 'restaurant' ? RestaurantService.MEILISEARCH_INDEX_NAME : OfferService.MEILISEARCH_INDEX_NAME).search(query, {
                        filter: `id IN [${ids.join(',')}]`,
                        limit: ids.length,
                    }).then(res => res.hits.map(hit => ({ ...hit, distance: paginated.find(p => p.id === hit.id)?.distance })))
                    : Promise.resolve([])
            )
        );

        return results.flat();
    }
      

    async searchRestaurants({ query, userLat, userLon, page, perPage }: SearchParams) {
        const offset = (page - 1) * perPage;
        const MAX_DISTANCE_METERS = 20000;
        const useGeo = typeof userLat === 'number' && typeof userLon === 'number';

        let nearbyRestaurants = [];
        if (useGeo) {
            nearbyRestaurants = await this.redisClientService.cacheOrFetch(
                this.getNearbyRestaurantsRedisKey(userLat, userLon, MAX_DISTANCE_METERS), 
                3 * 60, 
                () => this.queryNearbyRestaurants(userLat, userLon, MAX_DISTANCE_METERS)
            );
        }

        const paginated = nearbyRestaurants.slice(offset, offset + perPage);
        const ids = paginated.map(r => r.id);
        const distanceMap = new Map<unknown, number>(paginated.map(r => [r.id, parseFloat(r.distance)]));

        const result = await this.meiliSearch
            .index(RestaurantService.MEILISEARCH_INDEX_NAME)
            .search(query, {
                filter: `id IN [${ids.join(',')}]`,
                limit: ids.length,
            });

        return result.hits
            .map(hit => ({
                ...hit,
                distance: distanceMap.get(hit.id) ?? (useGeo ? Infinity : null),
            }))
            .sort((a, b) => a.distance - b.distance);
    }

    async searchOffers({ query, userLat, userLon, page, perPage }: SearchParams) {
        const offset = (page - 1) * perPage;
        const MAX_DISTANCE_METERS = 20000;
        const useGeo = typeof userLat === 'number' && typeof userLon === 'number';

        let nearbyOffers = [];
        if (useGeo) {
            nearbyOffers = await this.redisClientService.cacheOrFetch(
                this.getNearbyOffersRedisKey(userLat, userLon, MAX_DISTANCE_METERS), 
                3 * 60, 
                () => this.queryNearbyOffers(userLat, userLon, MAX_DISTANCE_METERS)
            );
        }

        const paginated = nearbyOffers.slice(offset, offset + perPage);
        const ids = paginated.map(r => r.id);
        const distanceMap = new Map<unknown, number>(paginated.map(r => [r.id, parseFloat(r.distance)]));

        const result = await this.meiliSearch
            .index(OfferService.MEILISEARCH_INDEX_NAME)
            .search(query, {
                filter: `id IN [${ids.join(',')}]`,
                limit: ids.length,
            });

        return result.hits
            .map(hit => ({
                ...hit,
                distance: distanceMap.get(hit.id) ?? (useGeo ? Infinity : null),
            }))
            .sort((a, b) => a.distance - b.distance);
    }

    async getRestaurant(restaurantId: string) {
        return await new RestaurantDetailedView(await this.restaurantRepository.findOneBy({ id: restaurantId }));
    }

    private async queryNearbyRestaurants(userLat: number, userLon: number, radius: number) {
        const nearbyRestaurants = await this.restaurantRepository
            .createQueryBuilder('r')
            .select([
            'r.id AS id',
            `'restaurant' AS type`,
            `ST_DistanceSphere(r.location, ST_MakePoint(:lon, :lat)) AS distance`,
            ])
            .where(`ST_DWithin(r.location, ST_MakePoint(:lon, :lat)::geography, :radius)`)
            .setParameters({ lat: userLat, lon: userLon, radius: radius })
            .getRawMany();

        return nearbyRestaurants;
    }

    private async queryNearbyOffers(userLat: number, userLon: number, radius: number) {
        const nearbyOffers = await this.offerRepository
            .createQueryBuilder('offer')
            .innerJoin('offer.menuItem', 'menuItem')
            .innerJoin('menuItem.restaurant', 'restaurant')
            .select([
            'offer.id AS id',
            `'offer' AS type`,
            `ST_DistanceSphere(restaurant.location, ST_MakePoint(:lon, :lat)) AS distance`,
            ])
            .where(`ST_DWithin(restaurant.location, ST_MakePoint(:lon, :lat)::geography, :radius)`)
            .setParameters({ lat: userLat, lon: userLon, radius: radius })
            .getRawMany();

        return nearbyOffers;
    }

    private getNearbyRestaurantsRedisKey(userLat: number, userLon: number, radius: number) {
        return `nearby-restaurants:${math.roundLat(userLat)}:${math.roundLon(userLon)}:${radius}`;
    }

    private getNearbyOffersRedisKey(userLat: number, userLon: number, radius: number) {
        return `nearby-offers:${math.roundLat(userLat)}:${math.roundLon(userLon)}:${radius}`;
    }
}

export class RestaurantGetParams {
    lat: number;
    lon: number;
    filterModes: string[];
    sortMode: string;
    page: number;
    perPage: number;
}

export class SearchParams {
    query: string;
    userLat?: number;
    userLon?: number;
    page: number;
    perPage: number;
}