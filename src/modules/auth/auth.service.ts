import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { isEqual } from 'lodash';
import { Auth, AuthStatus, AuthRole } from './auth.entity';
import { Repository } from 'typeorm';
import {
  CreateAuthDTO,
  UpdateAuthDTO,
  UpdateAuthPassDTO,
  UpdateAuthRoleDTO,
  UpdateAuthStatusDTO,
} from './auth.dto';
import config from '../../config';

@Service()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
  ) {}

  async getAuths(): Promise<Auth[]> {
    return this.authRepo.find();
  }

  async getAuthById(id: string): Promise<Auth> {
    const auth = await this.authRepo.findOne({ id });
    if (!auth) {
      throw new Error('auth not found');
    }
    return auth;
  }

  async createAuth(dto: CreateAuthDTO): Promise<Auth> {
    const { username, email, password, confirm, pass } = dto;

    if (password !== confirm) {
      throw new Error('password doesnot match');
    }
    if (pass !== config.createAuth && pass !== config.createAuthSuper) {
      throw new Error('not authorized');
    }

    const auth = new Auth();
    auth.username = username;
    auth.email = email;
    auth.password = password;
    if (pass === config.createAuthSuper) {
      auth.role = AuthRole.admin;
      auth.status = AuthStatus.active;
    }

    try {
      await auth.hashPass();
      await auth.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new Error(
          err.detail.includes('email')
            ? 'email already exists'
            : 'username already exists',
        );
      }
      throw new Error(err);
    }
    return auth;
  }

  async updateAuth(dto: UpdateAuthDTO, id: string): Promise<Auth> {
    const { username, email, twoStep, password } = dto;
    const auth = await this.getAuthById(id);

    if (!(await auth.comparePass(password))) {
      throw new Error('password invalid');
    }

    const curValue = {
      username: auth.username,
      email: auth.email,
      twoStep: auth.twoStep,
    };
    const nextValue = { username, email, twoStep };

    if (isEqual(curValue, nextValue)) {
      throw new Error('no changes made');
    }

    auth.username = username;
    auth.email = email;
    auth.twoStep = twoStep;

    try {
      await auth.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new Error(
          err.detail.includes('email')
            ? 'email already exists'
            : 'username already exists',
        );
      }
      throw new Error(err);
    }
    return auth;
  }

  async updateAuthPass(dto: UpdateAuthPassDTO, id: string): Promise<Auth> {
    const { old, password, confirm } = dto;

    if (password !== confirm) {
      throw new Error('password does not match');
    }

    const auth = await this.getAuthById(id);

    if (!(await auth.comparePass(old))) {
      throw new Error('password invalid');
    }
    if (old === password) {
      throw new Error('please try a different password');
    }

    auth.password = password;

    try {
      await auth.hashPass();
      await auth.save();
    } catch (err) {
      throw new Error(err);
    }
    return auth;
  }

  async updateAuthRole(dto: UpdateAuthRoleDTO, id: string): Promise<Auth> {
    const { role, password } = dto;
    const auth = await this.getAuthById(id);

    if (!(await auth.comparePass(password))) {
      throw new Error('password invalid');
    }
    if (auth.role === role) {
      throw new Error('no changes made');
    }

    auth.role = role;

    try {
      await auth.save();
    } catch (err) {
      throw new Error(err);
    }
    return auth;
  }

  async updateAuthStatus(dto: UpdateAuthStatusDTO, id: string): Promise<Auth> {
    const { status, password } = dto;
    const auth = await this.getAuthById(id);

    if (!(await auth.comparePass(password))) {
      throw new Error('password invalid');
    }
    if (auth.status === AuthStatus.notRegistered) {
      throw new Error('auth not registered');
    }
    if (auth.status === status) {
      throw new Error('no changes made');
    }

    auth.status = status;

    try {
      await auth.save();
    } catch (err) {
      throw new Error(err);
    }
    return auth;
  }
}
