import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { ClientProfile } from "./ClientProfile";
import { Restaurant } from "./Restaurant";
import { OrderItem } from "./OrderItem";
import { Review } from "./Review";
import { Exclude } from "class-transformer";

@Index("idx_orders_client", ["clientId"], {})
@Index("order_pkey", ["id"], { unique: true })
@Index("idx_orders_restaurant", ["restaurantId"], {})
@Entity("order", { schema: "public" })
export class Order {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "client_id" })
  clientId: string;

  @Column("uuid", { name: "restaurant_id" })
  restaurantId: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date | null;

  @Column("enum", {
    name: "status",
    enum: ["cancelled", "completed", "expired", "paid", "pending"],
    default: () => "'pending'",
  })
  status: "cancelled" | "completed" | "expired" | "paid" | "pending";

  @Column("date", { name: "pickup_date", nullable: true })
  pickupDate: string | null;

  @Column("text", { name: "pickup_time_range", nullable: true })
  pickupTimeRange: string | null;

  @Column("numeric", { name: "total_customer_paid", nullable: true })
  totalCustomerPaid: number | null;

  @Exclude()
  @Column("numeric", { name: "total_restaurant_payout", nullable: true })
  totalRestaurantPayout: number | null;

  @Exclude()
  @Column("numeric", { name: "total_platform_profit", nullable: true })
  totalPlatformProfit: number | null;

  @Column("text", { name: "verification_code" })
  verificationCode: string;

  @Exclude()
  @ManyToOne(() => ClientProfile, (clientProfile) => clientProfile.orders, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: ClientProfile;

  @Exclude()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: "SET NULL",
  })
  @JoinColumn([{ name: "restaurant_id", referencedColumnName: "id" }])
  restaurant: Restaurant;

  @Exclude()
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {cascade: true})
  orderItems: OrderItem[];

  @Exclude()
  @OneToOne(() => Review, (review) => review.order)
  review: Review;
}
