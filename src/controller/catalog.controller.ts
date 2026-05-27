import { Controller, Get, Param, Query } from "@nestjs/common";
import { CatalogService } from "../service/common/catalog.service";

@Controller()
export class CatalogController {
    constructor(
        private readonly catalogService: CatalogService
    ) {}

    @Get("catalog/restaurants")
    getRestaurants(
        @Query("latitude") latitude: string,
        @Query("longitude") longitude: string,
        @Query("filter_modes") filterModes = "all",
        @Query("sort_mode") sortMode = "popular",
        @Query("page") page = "1",
        @Query("per_page") perPage = "20"
    ) {
        let lon = 0, lat = 0;

        if(sortMode === "nearby") {
            if(!latitude || !longitude) {
                return {
                    error: true,
                    message: "latitude and longitude is required for nearby sort mode"
                }
            } else {
                lat = parseFloat(latitude);
                lon = parseFloat(longitude);
            }
        }

        const pageNum = parseInt(page);
        const perPageNum = parseInt(perPage);

        if(isNaN(lat) || isNaN(lon) || isNaN(pageNum) || isNaN(perPageNum)) {
            return {
                error: true,
                message: "latitude, longitude, page and per_page must be numbers"
            }
        }

        const filterModesArray = filterModes.split(",").map(mode => mode.trim());

        return this.catalogService.getRestaurants({
            lat, 
            lon, 
            filterModes: filterModesArray, 
            sortMode, 
            page: pageNum, 
            perPage: perPageNum
        });
    }

    @Get("catalog/search")
    globalSearch(
        @Query("query") query: string,
        @Query("user_lat") userLat: string,
        @Query("user_lon") userLon: string,
        @Query("page") page = "1",
        @Query("per_page") perPage = "20"
    ) {
        const pageNum = parseInt(page);
        const perPageNum = parseInt(perPage);

        if(isNaN(pageNum) || isNaN(perPageNum)) {
            return {
                error: true,
                message: "page and per_page must be numbers"
            }
        }

        if(userLat && userLon) {
            return this.catalogService.globalSearch({query, userLat: parseFloat(userLat), userLon: parseFloat(userLon), page: pageNum, perPage: perPageNum});
        }

        return this.catalogService.globalSearch({query, page: pageNum, perPage: perPageNum});
    }

    @Get("catalog/search/restaurants")
    searchRestaurants(
        @Query("query") query: string,
        @Query("user_lat") userLat: string,
        @Query("user_lon") userLon: string,
        @Query("page") page = "1",
        @Query("per_page") perPage = "20"
    ) {
        const pageNum = parseInt(page);
        const perPageNum = parseInt(perPage);

        if(isNaN(pageNum) || isNaN(perPageNum)) {
            return {
                error: true,
                message: "page and per_page must be numbers"
            }
        }

        if(userLat && userLon) {
            return this.catalogService.searchRestaurants({query, userLat: parseFloat(userLat), userLon: parseFloat(userLon), page: pageNum, perPage: perPageNum});
        }

        return this.catalogService.searchRestaurants({query, page: pageNum, perPage: perPageNum});
    }

    @Get("catalog/search/offers")
    searchOffers(
        @Query("query") query: string,
        @Query("user_lat") userLat?: string,
        @Query("user_lon") userLon?: string,
        @Query("page") page = "1",
        @Query("per_page") perPage = "20"
    ) {
        const pageNum = parseInt(page);
        const perPageNum = parseInt(perPage);

        if(isNaN(pageNum) || isNaN(perPageNum)) {
            return {
                error: true,
                message: "page and per_page must be numbers"
            }
        }

        if(userLat && userLon) {
            return this.catalogService.searchOffers({query, userLat: parseFloat(userLat), userLon: parseFloat(userLon), page: pageNum, perPage: perPageNum});
        }

        return this.catalogService.searchOffers({query, page: pageNum, perPage: perPageNum});
    }

    @Get("restaurants/:id")
    getRestaurant(@Param("id") id: string) {
        return this.catalogService.getRestaurant(id);
    }
}