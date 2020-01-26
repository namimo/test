import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AuthResolver } from '../modules/auth/auth.resolver';
import { LicenseResolver } from '../modules/license/license.resolver';
import { UserResolver } from '../modules/user/user.resolver';

const resolvers = [
  // Resolvers
  AuthResolver,
  LicenseResolver,
  UserResolver,
];
export const createSchema = () => {
  return buildSchema({
    resolvers,
    container: Container,
  });
};
