import "reflect-metadata"
import { DataSource } from "typeorm"
import { ClientProfile } from "./entity/ClientProfile"
import { Restaurant } from "./entity/Restaurant"
import { ActiveOffer } from "./entity/ActiveOffer"
import * as dotenv from "dotenv"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: 6543,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "postgres",
    synchronize: false,
    logging: false,
    entities: [__dirname + "/entity/*{.js,.ts}"],
    migrations: [],
    subscribers: []
})