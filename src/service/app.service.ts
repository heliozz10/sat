import { Injectable, OnModuleInit } from '@nestjs/common';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}
