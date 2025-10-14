import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

@Index("notification_pkey", ["id"], { unique: true })
@Entity("notification", { schema: "public" })
export class UserNotification {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("text", { name: "message" })
  message: string;

  @Column("text", { name: "link", nullable: true })
  link: string | null;

  @Column("boolean", { name: "is_read" })
  isRead: boolean;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;
}
