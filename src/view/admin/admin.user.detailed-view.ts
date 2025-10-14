import { ProfileType } from "../../enum/app.enums";
import { AdminClientProfileView } from "./admin.client-profile.view";
import { AdminRestaurantView } from "./admin.restaurant.view";
import { AdminUserView } from "./admin.user.view";

export class AdminUserDetailedView extends AdminUserView {
    profileType: ProfileType;
    profile: AdminClientProfileView | AdminRestaurantView;

    constructor(user: AdminUserView, profileType: ProfileType, profile: AdminClientProfileView | AdminRestaurantView) {
        super(user);
        this.profileType = profileType;
        this.profile = profile;
    }
}