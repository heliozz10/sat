import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ActiveOffer } from "./ActiveOffer";
import { Order } from "./Order";
import { Exclude } from "class-transformer";

@Index("order_item_pkey", ["id"], { unique: true })
@Entity("order_item", { schema: "public" })
export class OrderItem {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("integer", { name: "quantity", default: () => "1" })
  quantity: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("numeric", { name: "customer_price_item", nullable: true })
  customerPriceItem: number | null;

  @Exclude()
  @ManyToOne(() => ActiveOffer, (activeOffer) => activeOffer.orderItems)
  @JoinColumn([{ name: "active_offer_id", referencedColumnName: "id" }])
  activeOffer: ActiveOffer;

  @Exclude()
  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: Order;
}
