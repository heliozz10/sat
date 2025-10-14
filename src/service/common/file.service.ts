import { Injectable } from "@nestjs/common";
import { SupabaseClientService } from "./supabase-client.service";

@Injectable()
export class FileService {
    private supabase;

    constructor(
        private readonly supabaseClientService: SupabaseClientService
    ) {
        this.supabase = this.supabaseClientService.client;
    }

    async uploadFile(file: Express.Multer.File, bucketName: string, fileName: string) {
        const { data, error } = await this.supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) {
            throw error;
        }

        return data;
    }

    async getPublicUrl(bucketName: string, fileName: string) {
        const { data, error } = await this.supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        if (error) {
            throw error;
        }

        return data;
    }
}