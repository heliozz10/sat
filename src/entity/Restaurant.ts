import {
  Column,
  Entity,
  Geography,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";
import { ActiveOffer } from "./ActiveOffer";
import { ClientProfile } from "./ClientProfile";
import { MenuItem } from "./MenuItem";
import { Order } from "./Order";
import { Review } from "./Review";
import { Exclude } from "class-transformer";
import { RestaurantStatus } from "../enum/app.enums";

@Index("restaurant_pkey", ["id"], { unique: true })
@Index("restaurant_owner_id_key", ["ownerId"], { unique: true })
@Entity("restaurant", { schema: "public" })
export class Restaurant {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("text", { name: "address" })
  address: string;

  @Column("text", { name: "photo_url", nullable: true })
  photoUrl: string | null;

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

  @Column("uuid", { name: "owner_id", unique: true })
  ownerId: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Geography;
  
  @Column("enum", {
    name: "status",
    enum: ["approved", "blocked", "on_moderation", "rejected"],
    default: () => "'on_moderation'",
  })
  status: RestaurantStatus;

  @Column("numeric", { name: "average_rating", nullable: true })
  averageRating: number | null;

  @Exclude()
  @Column("timestamp with time zone", {
    name: "average_rating_last_calculated",
    nullable: true,
  })
  averageRatingLastCalculated: Date | null;

  @Column("bigint", { name: "reviews_count", nullable: true })
  reviewsCount: number | null;

  @Exclude()
  @Column("timestamp with time zone", {
    name: "reviews_count_last_calculated",
    nullable: true,
  })
  reviewsCountLastCalculated: Date | null;

  @Column("text", { name: "last_status_update_reason", nullable: true})
  lastStatusUpdateReason: string | null;

  @Exclude()
  @OneToMany(() => ActiveOffer, (activeOffer) => activeOffer.restaurant)
  activeOffers: ActiveOffer[];

  @Exclude()
  @ManyToMany(() => ClientProfile, (clientProfile) => clientProfile.favoriteRestaurants)
  clientProfiles: ClientProfile[];

  @Exclude()
  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
  menuItems: MenuItem[];

  @Exclude()
  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @Exclude()
  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];
}
