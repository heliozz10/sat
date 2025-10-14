import { Point } from "typeorm";
import { ClientProfile } from "../../entity/ClientProfile";
import { AdminUserView } from "./admin.user.view";

export class AdminClientProfileView {
    id: string;
    name: string;
    userId: string;
    address: string;
    location: {
        latitude: number;
        longitude: number;
    }

    constructor(clientProfile: ClientProfile) {
        this.id = clientProfile.id;
        this.name = clientProfile.name;
        this.userId = clientProfile.userId;
        this.address = clientProfile.address;
        this.location = {
            latitude: (clientProfile.location as Point).coordinates[1],
            longitude: (clientProfile.location as Point).coordinates[0]
        };
    }
}