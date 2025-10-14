import { Module } from "@nestjs/common";
import { FileService } from "../service/common/file.service";
import { SupabaseClientService } from "../service/common/supabase-client.service";

@Module({
    imports: [],
    controllers: [],
    providers: [FileService, SupabaseClientService],
    exports: [FileService, SupabaseClientService]
})
export class FileModule {}