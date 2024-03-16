import { RequestHandler } from "express";

export function CurrentUser(): ParameterDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const middleware: RequestHandler = (req, res, next) => {
      // Retrieve the current user from the request object
      const currentUser = req.currentUser;

      // Assign the current user to the decorated parameter
      Reflect.defineMetadata("currentUser", currentUser, target, propertyKey);

      next();
    };

    // Register the middleware to the route handler
    Reflect.defineMetadata("middleware", middleware, target, propertyKey);
  };
}
