import { AuthMiddleware } from './isAuth';
import { AdminMiddleware } from './isAdmin';

export const isAuth = AuthMiddleware;
export const isAdmin = AdminMiddleware;
