import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "IsTimeRange", async: false })
export class IsTimeRange implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])-(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!regex.test(value)) {
            return false;
        }
        
        const [start, end] = value.split('-');
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        return endHours > startHours || (endHours === startHours && endMinutes > startMinutes);
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return "Pickup time range is invalid. It must be in the format HH:MM-HH:MM";
    }
}