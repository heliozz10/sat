import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { ClientProfile } from "./ClientProfile";
import { Order } from "./Order";
import { Restaurant } from "./Restaurant";
import { Exclude } from "class-transformer";

@Index("review_pkey", ["orderId"], { unique: true })
@Entity("review", { schema: "public" })
export class Review {
  @Column("uuid", {
    primary: true,
    name: "order_id",
    default: () => "gen_random_uuid()",
  })
  orderId: string;

  @Column("smallint", { name: "rating" })
  rating: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Exclude()
  @ManyToOne(() => ClientProfile, (clientProfile) => clientProfile.reviews, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: ClientProfile;

  @Exclude()
  @OneToOne(() => Order, (order) => order.review, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: Order;

  @Exclude()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "restaurant_id", referencedColumnName: "id" }])
  restaurant: Restaurant;
}
