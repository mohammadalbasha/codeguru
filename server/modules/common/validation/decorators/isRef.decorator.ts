import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

@ValidatorConstraint({ name: "isRef", async: false })
class IsRefConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    // Get the desired ID from the validation arguments
    const desiredId = args.constraints[0];

    // Perform the validation logic
    // In this example, check if a category with the desired ID exists
    const categoryExists = true; // Your logic to check if the category exists

    // Return true if the category exists, false otherwise
    return categoryExists;
  }

  defaultMessage(args: ValidationArguments): string {
    return `The ${args.property} must be a valid reference to a category with ID ${args.constraints[0]}.`;
  }
}

export function isRef(
  desiredId: number,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [desiredId],
      validator: IsRefConstraint,
    });
  };
}
