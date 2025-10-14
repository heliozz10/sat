import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class GeographyService {
    constructor() {}

    async getAddressFromCoordinates(lat: number, long: number): Promise<string> {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                format: 'json',
                lat: lat,
                lon: long,
                "accept-language": "ru"
            },
            headers: {
                "User-Agent": "KazakhstanSat/1.0"
            },
            timeout: 5000
        });
    
        return response.data.display_name;
    }
}