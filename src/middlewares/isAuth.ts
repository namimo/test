import { MiddlewareFn, ResolverData, NextFn } from 'type-graphql';
import { BaseContext } from '../utils/context';
import jwt from 'jsonwebtoken';
import config from '../config';
import { Auth } from '../modules/auth/auth.entity';

export const AuthMiddleware: MiddlewareFn<BaseContext> = async (
  { context }: ResolverData<BaseContext>,
  next: NextFn,
) => {
  const key = 'authorization';
  const token = context.req.headers[key];

  if (!token) {
    throw new Error('token invalid');
  }

  try {
    const { id, twoStep, twoStepKey }: any = jwt.verify(
      token,
      config.authLoginJwt,
    );
    const auth = await Auth.findOneOrFail({ id });

    if (twoStep && auth.twoStepKey !== twoStepKey) {
      throw new Error('token invalid');
    }

    context.req.auth = auth;
    return next();
  } catch (err) {
    throw new Error('token invalid');
  }
};
