import {
  Column,
  Entity,
  Geography,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Restaurant } from "./Restaurant";
import { Order } from "./Order";
import { Review } from "./Review";
import { Exclude } from "class-transformer";

@Index("client_profile_pkey", ["id"], { unique: true })
@Index("client_tables_user_id_key", ["userId"], { unique: true })
@Entity("client_profile", { schema: "public" })
export class ClientProfile {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

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

  @Column("uuid", { name: "user_id", unique: true })
  userId: string;

  @Column("text", { name: "address" })
  address: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Geography;

  @Exclude()
  @ManyToMany(() => Restaurant, (restaurant) => restaurant.clientProfiles)
  @JoinTable({
    name: "favorite_restaurant",
    joinColumns: [{ name: "client_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "restaurant_id", referencedColumnName: "id" }],
    schema: "public",
  })
  favoriteRestaurants: Restaurant[];

  @Exclude()
  @OneToMany(() => Order, (order) => order.client)
  orders: Order[];

  @Exclude()
  @OneToMany(() => Review, (review) => review.client)
  reviews: Review[];
}
