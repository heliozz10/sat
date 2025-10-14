import { Column, Entity, Index } from "typeorm";

@Index("payment_pkey", ["id"], { unique: true })
@Entity("payment", { schema: "public" })
export class Payment {
    @Column("uuid", {
        primary: true,
        name: "id",
        default: () => "gen_random_uuid()",
    })
    id: string;

    @Column("text", { name: "gateway_payment_id", nullable: false })
    gatewayPaymentId: string | null;

    @Column("enum", {
        name: "status",
        enum: ["failed", "paid", "pending"],
        default: () => "'pending'",
    })
    status: "cancelled" | "completed" | "expired" | "paid" | "pending";

    @Column("timestamp with time zone", {
        name: "created_at",
        nullable: true,
        default: () => "now()",
    })
    createdAt: Date | null;
}