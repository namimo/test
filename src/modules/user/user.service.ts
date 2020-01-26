import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import jwt from 'jsonwebtoken';
import { isEqual } from 'lodash';

import { User, UserStatus } from './user.entity';
import { Repository } from 'typeorm';
import { LicenseService } from '../license/license.service';
import { MailService } from '../../utils/nodemailer.service';
import { CreateUserDTO, UpdateUserDTO, UpdateUserPassDTO } from './user.dto';
import config from '../../config';
import nPlus1 from '../../utils/nPlus1';

@Service()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private licenseService: LicenseService,
    private mailService: MailService,
  ) {}

  async getUsers(info: any): Promise<User[]> {
    const relations = info ? nPlus1(info, ['license']) : undefined;
    return this.userRepo.find({ relations });
  }

  async getUserById(id: string, info?: any): Promise<User> {
    const relations = info ? nPlus1(info, ['license']) : undefined;
    const user = await this.userRepo.findOne({ where: [{ id }], relations });

    if (!user) {
      throw new Error('user not found');
    }

    return user;
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const { username, email, password, confirm, licenseId } = dto;

    if (password !== confirm) {
      throw new Error('password doesnot match');
    }

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.activationKey = jwt.sign({ email }, config.userRegisterJwt, {
      expiresIn: '2d',
    });
    user.license = await this.licenseService.getLicenseById(licenseId);

    try {
      await user.hashPass();
      await user.save();
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

    this.mailService.emailConfirm(user);

    return user;
  }

  async updateUser(dto: UpdateUserDTO, id: string): Promise<User> {
    const { username, twoStep, role, status } = dto;
    const user = await this.getUserById(id);

    if (user.status === UserStatus.notRegistered) {
      throw new Error('user not registered');
    }
    const curValue = {
      username: user.username,
      twoStep: user.twoStep,
      role: user.role,
      status: user.status,
    };
    const nextValue = { username, twoStep, role, status };

    if (isEqual(curValue, nextValue)) {
      throw new Error('no changes made');
    }

    user.username = username;
    user.twoStep = twoStep;
    user.role = role;
    user.status = status;
    if (status === UserStatus.disabled) {
      user.disabledAt = new Date().toUTCString();
    }

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new Error('username already exists');
      }
      throw new Error(err);
    }
    return user;
  }

  async updateUserEmail(email: string, id: string): Promise<User> {
    const user = await this.userRepo.find({ where: [{ id }, { email }] });

    if (user.length === 2) {
      throw new Error('email already exists');
    }
    if (user.length === 0 || user[0].id !== id) {
      throw new Error('user not found');
    }
    if (user[0].email === email) {
      throw new Error('cannot change to same email');
    }

    const key = jwt.sign(
      { old: user[0].email, new: email },
      config.userEmailChangeJwt,
      { expiresIn: '2d' },
    );

    this.mailService.emailChange(email, user[0], key);
    return user[0];
  }

  async updateUserPass(dto: UpdateUserPassDTO, id: string): Promise<User> {
    const { password, confirm } = dto;

    if (password !== confirm) {
      throw new Error('password does not match');
    }

    const user = await this.getUserById(id);

    if (await user.comparePass(password)) {
      throw new Error('no changes made');
    }

    user.password = password;

    try {
      await user.hashPass();
      await user.save();
    } catch (error) {
      throw new Error(error);
    }

    return user;
  }
}
