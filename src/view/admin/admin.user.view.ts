import { UserStatus } from "../../enum/app.enums";

//afaik this is not used. Use get_user_info rpc
export class AdminUserView {
    id: string;
    phone: string;
    email?: string;
    status: UserStatus;

    constructor(user: AdminUserView) {
        this.id = user.id;
        this.email = user.email;
        this.phone = user.phone;
        this.status = user.status;
    }
}