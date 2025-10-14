import { Controller, Delete, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AdminReviewService } from "../../service/admin/admin.review.service";
import { ProfileType } from "../../enum/app.enums";
import { JwtAuthGuard } from "../../guard/jwt-auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { Roles } from "../../decorator/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/reviews")
export class AdminReviewController {
    constructor(
        private readonly adminReviewService: AdminReviewService
    ) {}

    @Get()
    getReviews(
        @Query("profile_type") profileType: string,
        @Query("id") id: string,
        @Query("page") page: string = "1",
        @Query("per_page") perPage: string = "20"
    ) {
        let pageNum = parseInt(page);
        let perPageNum = parseInt(perPage);

        if(isNaN(pageNum) || isNaN(perPageNum)) {
            return {
                error: true,
                message: "page and per_page must be numbers"
            }
        }

        if(!profileType || !id) {
            return {
                error: true,
                message: "profile_type and id is required"
            }
        }

        if(profileType !== "client" && profileType !== "restaurant") {
            return {
                error: true,
                message: "profile_type must be either client or restaurant"
            }
        }

        return this.adminReviewService.getReviews(pageNum, perPageNum, profileType as ProfileType, id);
    }

    @Delete(":id")
    deleteReview(@Param("id") reviewId: string) {
        return this.adminReviewService.deleteReview(reviewId);
    }
}