import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { RequestValidationError } from "../errors/request-validation-error";

function validationFactory<T>(
  metadataKey: Symbol,
  model: { new (...args: any[]): T },
  source: "body" | "query"
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<Function>
  ) {
    Reflect.defineMetadata(metadataKey, model, target, propertyName);

    const method = descriptor.value;
    descriptor.value = async function () {
      const model = Reflect.getOwnMetadata(metadataKey, target, propertyName);

      const [req, res] = arguments;
      const plain = req[source];

      const errors = (await validate(
        plainToClass(model, plain)
      )) as ValidationError[];
      if (errors.length > 0) {
        //res.status(400).json(transformValidationErrorsToJSON(errors));

        const error = new RequestValidationError(
          transformValidationErrorsToArray(errors)
        );
        return res
          .status(error.statusCode)
          .json({ errors: error.serializeErrors() });
      }

      return method!.apply(this, arguments);
    };
  };
}

export const ValidateQuery = (dto: any) =>
  validationFactory(Symbol("validate-query"), dto, "query");
export const ValidateBody = (dto: any) =>
  validationFactory(Symbol("validate-body"), dto, "body");

function transformValidationErrorsToJSON(errors: ValidationError[]) {
  return errors.reduce((p, c: ValidationError) => {
    if (!c.children || !c.children.length) {
      p[c.property] = Object.keys(c.constraints).map(
        (key) => c.constraints[key]
      );
    } else {
      p[c.property] = transformValidationErrorsToJSON(c.children);
    }
    return p;
  }, {});
}

function transformValidationErrorsToArray(errors: ValidationError[]) {
  return errors.reduce((p, c: ValidationError) => {
    if (!c.children || !c.children.length) {
      Object.keys(c.constraints).map((key) => {
        p.push({
          type: c.property,
          msg: c.constraints[key],
        });
      });
    } else {
      // p.push({
      //   field: c.property,
      //   msg: transformValidationErrorsToJSON(c.children),
      // });
    }
    return p;
  }, []);
}
