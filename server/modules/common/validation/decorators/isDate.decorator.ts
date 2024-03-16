import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "customIsDate", async: false })
class CustomIsDateConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value === "string") {
      return !isNaN(Date.parse(value));
    } else if (value instanceof Date) {
      return !isNaN(value.getTime());
    } else if (typeof value === "number") {
      return !isNaN(value);
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid date.`;
  }
}

export function IsCustomDate(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string | symbol) {
    registerDecorator({
      name: "isCustomDate",
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: CustomIsDateConstraint,
    });
  };
}
