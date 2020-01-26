import { MiddlewareFn } from "type-graphql";
import { License, LicenseType } from "../entity/License";

export const isMedium: MiddlewareFn = async (_, next) => {
  const license = (await License.findOne({ id: 1 })) as License;
  if (license.type === LicenseType.small) {
    throw new Error("Not authorized");
  } else {
    return next();
  }
};
