import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("platform_setting", { schema: "public" })
export class PlatformSetting {
  @PrimaryColumn("text", { name: "key" })
  key: string;

  @Column("text", { name: "value" })
  value: string;
}