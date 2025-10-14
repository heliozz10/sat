import { Injectable } from "@nestjs/common";
import { Meilisearch } from "meilisearch";

@Injectable()
export class MeiliSearchClientService {
    private meiliSearchClient: Meilisearch;

    constructor() {
        this.meiliSearchClient = new Meilisearch({
            host: `http://${process.env.MEILISEARCH_HOST}:${process.env.MEILISEARCH_PORT}`, 
            apiKey: process.env.MEILISEARCH_API_KEY
        });
    }

    get client() {
        return this.meiliSearchClient;
    }
}