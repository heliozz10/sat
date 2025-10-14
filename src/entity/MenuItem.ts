import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Restaurant } from "./Restaurant";
import { ActiveOffer } from "./ActiveOffer";
import { Exclude } from "class-transformer";

@Index("menu_item_pkey", ["id"], { unique: true })
@Index("idx_menu_dishes_restaurant", ["restaurantId"], {})
@Entity("menu_item", { schema: "public" })
export class MenuItem {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "restaurant_id", nullable: true })
  restaurantId: string | null;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("numeric", { name: "base_price", precision: 8, scale: 2 })
  basePrice: number;

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

  @Exclude()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "restaurant_id", referencedColumnName: "id" }])
  restaurant: Restaurant;

  @Exclude()
  @OneToMany(() => ActiveOffer, (activeOffer) => activeOffer.menuItem)
  activeOffers: ActiveOffer[];
}
