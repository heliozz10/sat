import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { ActiveOffer } from "../../entity/ActiveOffer";
import { OfferActivationDto } from "../../dto/menu/offer-activation.dto";
import { MenuItem } from "../../entity/MenuItem";
import { RestaurantService } from "./restaurant.service";
import { MeiliSearchClientService } from "../common/meilisearch-client.service";
import { MeiliSearch } from "meilisearch";
import { ActiveOfferView } from "../../view/active-offer.view";
import { AdminPlatformSettingService } from "../admin/admin.platform-setting.service";

@Injectable()
export class OfferService {
    public static MEILISEARCH_INDEX_NAME = "active-offer-views";

    private meiliSearch: MeiliSearch;

    constructor(
        private readonly meiliSearchClientService: MeiliSearchClientService,
        private readonly platformSettingService: AdminPlatformSettingService,
        private readonly restaurantService: RestaurantService,
        @InjectRepository(ActiveOffer) private readonly offerRepository: Repository<ActiveOffer>,
        @InjectRepository(MenuItem) private readonly menuItemRepository: Repository<MenuItem>
    ) {
        this.meiliSearch = this.meiliSearchClientService.client;

        this.meiliSearch.getIndex(OfferService.MEILISEARCH_INDEX_NAME).catch(() => {
            this.meiliSearch.createIndex(OfferService.MEILISEARCH_INDEX_NAME, {
                primaryKey: "id"
            });
        }).then(() => {
            this.meiliSearch.index(OfferService.MEILISEARCH_INDEX_NAME).updateSettings({
                searchableAttributes: ["name", "boxCategory", "menuItem.name", "menuItem.restaurant.name", "menuItem.restaurant.address"],
                filterableAttributes: ["id"],
                typoTolerance: {
                    enabled: true,
                    minWordSizeForTypos: {
                        oneTypo: 3,
                        twoTypos: 7
                    }
                }
            });
        });
    }

    async activateOffer(userId: string, offerActivationDto: OfferActivationDto) {
        const restaurant = await this.restaurantService.getRestaurantByUserId(userId);

        if(restaurant.status !== "approved") {
            throw new UnauthorizedException("Restaurant is not approved");
        }

        const offer = this.offerRepository.create(offerActivationDto);

        offer.restaurant = restaurant;

        if(offerActivationDto.type === "single_dish") {
            const menuItem = await this.menuItemRepository.findOneBy({id: offerActivationDto.menuItemId});
            offer.menuItem = menuItem;
        } else if(offerActivationDto.type === "happy_box") {
            if(!offerActivationDto.boxCategory) {
                throw new Error("Box category is required for happy box offer");
            }
        }

        offer.restaurantPrice = offer.menuItem.basePrice * (1 - offerActivationDto.discount / 100);
        offer.customerPrice = offer.restaurantPrice * (1 + parseFloat((await this.platformSettingService.getPlatformSetting("markup_percentage")).value) / 100);

        await this.indexOffer(new ActiveOfferView(offer));

        offer.expiresAt = new Date(`${offer.pickupDate}T${offer.pickupTimeRange.split("-")[1]}:00`);
        
        offer.createdAt = new Date();
        return await this.offerRepository.save(offer);
    }

    async deactivateOffer(offerId: string) {
        await this.offerRepository.delete({id: offerId});
    }

    async deactivateExpiredOffers() {
        await this.offerRepository.delete({expiresAt: LessThan(new Date())});
    }

    async getActiveOffers(userId: string) {
        this.offerRepository.findBy({restaurant: await this.restaurantService.getRestaurantByUserId(userId)});
    }

    private async indexOffer(offerView: ActiveOfferView) {
        await this.meiliSearch.index(OfferService.MEILISEARCH_INDEX_NAME).addDocuments([offerView]);
    }
}