import { MiddlewareFn, ResolverData, NextFn } from 'type-graphql';
import { BaseContext } from '../utils/context';
import { AuthRole } from '../modules/auth/auth.entity';

export const AdminMiddleware: MiddlewareFn<BaseContext> = async (
  { context }: ResolverData<BaseContext>,
  next: NextFn,
) => {
  const auth = context.req.auth;
  if (auth.role === AuthRole.admin) {
    return next();
  } else {
    throw new Error('unauthorized');
  }
};
