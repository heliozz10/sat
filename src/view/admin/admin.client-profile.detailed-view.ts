import { ClientProfile } from "../../entity/ClientProfile";
import { AdminClientProfileView } from "./admin.client-profile.view";
import { AdminUserView } from "./admin.user.view";

export class AdminClientProfileDetailedView extends AdminClientProfileView {
    orders: {
        id: string;
        status: string;
    }[];

    constructor(clientProfile: ClientProfile) {
        super(clientProfile);
        this.orders = clientProfile. orders;;
    }
}