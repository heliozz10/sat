import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientProfile } from "../../entity/ClientProfile";
import { MeiliSearchClientService } from "../common/meilisearch-client.service";
import { MeiliSearch } from "meilisearch";
import { SupabaseClientService } from "../common/supabase-client.service";
import { AdminClientProfileDetailedView } from "../../view/admin/admin.client-profile.detailed-view";
import { AdminUserView } from "../../view/admin/admin.user.view";

export class AdminClientService {
    public static readonly MEILISEARCH_INDEX_NAME = "admin-client-profile-views";

    private supabase;
    private meiliSearch: MeiliSearch;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        private readonly meiliSearchClientService: MeiliSearchClientService,
        @InjectRepository(ClientProfile) private readonly clientProfileRepository: Repository<ClientProfile>
    ) {
        this.supabase = this.supabaseClientService.client;
        this.meiliSearch = this.meiliSearchClientService.client;

        this.meiliSearch.getIndex(AdminClientService.MEILISEARCH_INDEX_NAME).catch(() => {
            this.meiliSearch.createIndex(AdminClientService.MEILISEARCH_INDEX_NAME, {
                primaryKey: "id"
            });
        }).then(() => {
            this.meiliSearch.index(AdminClientService.MEILISEARCH_INDEX_NAME).updateSettings({
                searchableAttributes: ["name", "user.email", "address"],
                filterableAttributes: ["id", "user.phone"],
                typoTolerance: {
                    enabled: true,
                    minWordSizeForTypos: {
                        oneTypo: 3,
                        twoTypos: 7
                    }
                }
            });
        });
    }

    async getClients(page: number, perPage: number, nameQuery?: string, phone?: string) {
        const searchOptions: any = {
            page: page,
            hitsPerPage: perPage
        };
    
        if (phone) {
            searchOptions.filter = `user.phone = "${phone}"`; // Meilisearch expects correct syntax
        }
    
        const searchResult = await this.meiliSearch
            .index(AdminClientService.MEILISEARCH_INDEX_NAME)
            .search(nameQuery || '', searchOptions);
    
        const clients = searchResult.hits;
    
        const userIds = clients.map(c => c.userId); // assuming `userId` is stored in indexed docs
        const { data: userInfo, error } = await this.supabase.rpc('get_user_info', { uids: userIds });
        const userInfoMap = new Map(userInfo.map(user => [user.id, user]));
    
        const clientsWithUserInfo = clients.map(client => ({
            ...client,
            userInfo: userInfoMap.get(client.userId) ?? null
        }));
    
        return clientsWithUserInfo;
    }
    

    async getClient(clientId: string) {
        const [client, { data: userInfo, error }] = await Promise.all([
            this.clientProfileRepository.findOneBy({ id: clientId }),
            this.supabase.rpc("get_user_info", {
                uids: [clientId]
            })
        ]);

        if (error) {
            throw error;
        }

        const view = {
            ...new AdminClientProfileDetailedView(client),
            userInfo: userInfo[0] ?? null
        };

        return view;
    }
    
}