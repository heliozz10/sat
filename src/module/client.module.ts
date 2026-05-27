import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientController } from "../controller/client.controller";
import { ClientService } from "../service/client/client.service";
import { ClientProfile } from "../entity/ClientProfile";
import { GeographyService } from "../service/common/geography.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ClientProfile])
    ],
    controllers: [ClientController],
    providers: [ClientService, GeographyService],
    exports: [ClientService]
})
export class ClientModule {}