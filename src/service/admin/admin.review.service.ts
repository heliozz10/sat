import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "../../entity/Review";
import { Repository } from "typeorm";
import { ProfileType } from "../../enum/app.enums";
import { AdminReviewView } from "../../view/admin/admin.review.view";

@Injectable()
export class AdminReviewService {
    constructor(
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>
    ) {}

    /**
     * Returns filtered reviews
     * @param profileType can be either "client" or "restaurant"
     * @param id search by either client id or restaurant id
     */
    async getReviews(page: number, perPage: number, profileType: ProfileType, id: string) {
        return (await this.reviewRepository.find({
            where: {
                [profileType]: {
                    id
                }
            },
            order: {
                createdAt: "DESC"
            },
            skip: (page - 1) * perPage,
            take: perPage
        })).map(review => new AdminReviewView(review));
    }

    async deleteReview(reviewId: string) {
        return this.reviewRepository.delete({orderId: reviewId});
    }
}