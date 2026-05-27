import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientProfile } from "../../entity/ClientProfile";
import { Repository } from "typeorm";
import { UpdateClientProfileDto } from "../../dto/client/update-profile.dto";
import { GeographyService } from "../common/geography.service";

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientProfile) private readonly clientProfileRepository: Repository<ClientProfile>,
        private readonly geographyService: GeographyService
    ) {}

    async getClient(userId: string) {
        return this.clientProfileRepository.findOneBy({ userId });
    }

    async updateClient(userId: string, dto: UpdateClientProfileDto) {
        this.clientProfileRepository.update({ userId }, { name: dto.fullName, location: dto.location ? {
            type: "Point",
            coordinates: [dto.location.longitude, dto.location.latitude]
        } : undefined, address: dto.location ? await this.geographyService.getAddressFromCoordinates(dto.location.latitude, dto.location.longitude) : undefined });
    }
}