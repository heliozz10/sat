import { Injectable } from "@nestjs/common";
import { MenuItem } from "../../entity/MenuItem";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MenuItemDto } from "../../dto/menu/add-menu-item.dto";
import { FileService } from "../common/file.service";
import { RestaurantService } from "./restaurant.service";

@Injectable()
export class MenuService {
    constructor(
        private readonly fileService: FileService,
        private readonly restaurantService: RestaurantService,
        @InjectRepository(MenuItem) private menuItemRepository: Repository<MenuItem>
    ) {}

    async addMenuItem(userId: string, dto: MenuItemDto, newPhoto?: Express.Multer.File) {
        const menuItem = this.menuItemRepository.create(dto);

        menuItem.restaurant = await this.restaurantService.getRestaurantByUserId(userId);

        if (newPhoto) {
            await this.uploadPhoto(userId, newPhoto);
        }

        menuItem.createdAt = new Date();
        return this.menuItemRepository.save(menuItem);
    }

    async getMenuItems(userId: string) {
        return this.menuItemRepository.find({
            where: {
                restaurant: {
                    ownerId: userId
                }
            }
        });
    }

    async getMenuItem(userId: string, menuItemId: string) {
        return this.menuItemRepository.findOneBy({
            id: menuItemId,
            restaurant: {
                ownerId: userId
            }
        });
    }

    async updateMenuItem(userId: string, menuItemId: string, dto: MenuItemDto, newPhoto?: Express.Multer.File) {
        const updatePayloadRaw = {
            ...dto,
            updatedAt: new Date()
        };

        let updatePayload;

        if (newPhoto) {
            const url = await this.uploadPhoto(userId, newPhoto);
            updatePayload = {
                ...updatePayloadRaw,
                photoUrl: url
            }
        } else {
            updatePayload = updatePayloadRaw;
        }

        return this.menuItemRepository.update({
            id: menuItemId,
            restaurant: {
                ownerId: userId
            }
        }, updatePayload);
    }

    async deleteMenuItem(userId: string, menuItemId: string) {
        return this.menuItemRepository.delete({
            id: menuItemId,
            restaurant: {
                ownerId: userId
            }
        });
    }

    private async uploadPhoto(userId: string, newPhoto: Express.Multer.File): Promise<string> {
        const fileExtension = newPhoto.originalname.split('.').pop();
        const filePath = `menu-items/${userId}/${new Date()}.${fileExtension}`;

        await this.fileService.uploadFile(newPhoto, 'menu-item-photos', filePath);

        return await this.fileService.getPublicUrl('menu-item-photos', filePath);
    }
}