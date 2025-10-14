import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../../entity/Order";
import { In, LessThan, Repository } from "typeorm";
import { CreateOrdersDto } from "../../dto/client/create-order.dto";
import { ActiveOffer } from "../../entity/ActiveOffer";
import { OrderItem } from "../../entity/OrderItem";
import { Payment } from "../../entity/Payment";
import { AddReviewDto } from "../../dto/client/add-review.dto";
import { Review } from "../../entity/Review";
import { SupabaseClientService } from "../common/supabase-client.service";

@Injectable()
export class OrderService {
    private supabase;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(ActiveOffer) private readonly offerRepository: Repository<ActiveOffer>,
        @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>
    ) {
        this.supabase = this.supabaseClientService.client;
    }

    async initiatePayment(clientId: string, dto: CreateOrdersDto) {
        const ids = dto.items.map((item) => item.offerId);

        const offers = await this.offerRepository.find({
                where: { 
                    id: In(ids)
                },
                relations: ["restaurant"]
            }
        );

        const entityMap = new Map(offers.map((entity) => [entity.id, entity]));

        class OrderKey {
            restaurantId: string;
            pickupDate: string;
            pickupTimeRange: string;
        };

        const orderMap: Map<OrderKey, Order> = new Map<OrderKey, Order>();

        const errors: string[] = [];
        
        for(const item of dto.items) {
            const offer = entityMap.get(item.offerId);

            if(!offer) {
                errors.push(`Offer with id ${item.offerId} does not exist.`);
            }

            if(offer.quantity < item.quantity) {
                errors.push(`Offer ${offer.name} has only ${offer.quantity} left.`);
            }

            offer.quantity -= item.quantity;

            const key = {
                restaurantId: offer.restaurant.id,
                pickupDate: offer.pickupDate,
                pickupTimeRange: offer.pickupTimeRange
            };

            let order = orderMap.get(key);

            if(!order) {
                order = this.orderRepository.create({
                    clientId,
                    restaurantId: offer.restaurant.id,
                    createdAt: new Date(),
                    status: "pending",
                    pickupDate: offer.pickupDate,
                    pickupTimeRange: offer.pickupTimeRange,
                    totalCustomerPaid: 0,
                    totalRestaurantPayout: 0,
                    totalPlatformProfit: 0,
                    orderItems: []
                });

                orderMap.set(key, order);
            }

            order.orderItems.push(
                this.orderItemRepository.create({
                    activeOffer: offer,
                    quantity: item.quantity,
                    createdAt: new Date(),
                    customerPriceItem: offer.customerPrice,
                    order
                })
            );

            order.totalCustomerPaid += offer.customerPrice * item.quantity;
            order.totalRestaurantPayout += offer.restaurantPrice * item.quantity;
            order.totalPlatformProfit += (offer.customerPrice - offer.restaurantPrice) * item.quantity;
        }

        const orders = Array.from(orderMap.values());

        this.offerRepository.save(offers);
        this.orderRepository.save(orders);

        const totalCustomerPaid = orders.reduce((current, subtotal) => current + subtotal.totalCustomerPaid, 0);

        return errors ? {
            success: false,
            errors
        } : {
            success: true,
            paymentUrl: `https://www.testpayment.com/${totalCustomerPaid}`
        };
    }

    async getOrders(clientId: string) {
        return await this.orderRepository.find({
            where: {
                clientId
            }
        });
    }

    async addReview(clientId: string, orderId: string, dto: AddReviewDto) {
        this.supabase.rpc("add_review", {
            order_id: orderId,
            client_id: clientId,
            rating: dto.rating
        });
    }

    private generateVerificationCode() {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }
}