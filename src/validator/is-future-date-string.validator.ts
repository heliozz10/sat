import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "IsFutureDateString", async: false })
export class IsFutureDateString implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        return new Date(value) > new Date();
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a future date string`;
    }
}