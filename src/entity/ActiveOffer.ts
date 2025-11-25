import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Restaurant } from "./Restaurant";
import { OrderItem } from "./OrderItem";
import { MenuItem } from "./MenuItem";
import { Exclude, Type } from "class-transformer";
import { OfferType } from "../enum/app.enums";


@Index("active_offer_pkey", ["id"], { unique: true })
@Index('idx_active_offer_pickup_date', ['pickupDate'])
@Index('idx_active_offer_restaurant_id', ['restaurant'])
@Entity("active_offer", { schema: "public" })
export class ActiveOffer {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("enum", {
    name: "type",
    enum: ["happy_box", "single_dish"],
    default: () => "'single_dish'",
  })
  type: OfferType;

  @Column("text", { name: "box_category", nullable: true })
  boxCategory: string | null;

  @Column("text", { name: "name" })
  name: string;

  @Column("integer", { name: "quantity", default: () => 1 })
  quantity: number;

  @Column("date", { name: "pickup_date", nullable: true })
  pickupDate: string | null;

  @Column("text", { name: "pickup_time_range", nullable: true })
  pickupTimeRange: string | null;

  @Column("numeric", { name: "restaurant_price", default: () => 0 })
  restaurantPrice: number;

  @Column("numeric", { name: "customer_price" , default: () => 0 })
  customerPrice: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "expires_at",
    default: () => "now()",
  })
  expiresAt: Date;

  @Exclude()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.activeOffers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "restaurant_id", referencedColumnName: "id" }])
  restaurant: Restaurant;

  @Type(() => MenuItem)
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.activeOffers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "menu_item_id", referencedColumnName: "id" }])
  menuItem: MenuItem;

  @Exclude()
  @OneToMany(() => OrderItem, (orderItem) => orderItem.activeOffer)
  orderItems: OrderItem[];
}
