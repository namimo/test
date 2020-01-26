import { MiddlewareFn } from "type-graphql";
import { License, LicenseType } from "../entity/License";

export const isLarge: MiddlewareFn = async (_, next) => {
  const license = (await License.findOne({ id: 1 })) as License;
  if (license.type === LicenseType.large) {
    return next();
  } else {
    throw new Error("Not authorized");
  }
};
