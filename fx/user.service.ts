import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import jwt from 'jsonwebtoken';
import { User, UserStatus, UserRole } from './user.entity';
import { Repository } from 'typeorm';
import { LicenseService } from '../license/license.service';
import { MailService } from '../../utils/nodemailer.service';
import { CreateUserDTO, UpdateUserPasswordDTO } from './user.dto';
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

  async userEmailResend(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ email });

    if (!user) {
      throw new Error('user not found');
    }

    if (user.status === UserStatus.active) {
      throw new Error('user already confirmed');
    }
    if (user.status === UserStatus.disabled) {
      throw new Error('user disabled');
    }

    user.activationKey = jwt.sign({ email }, config.userRegisterJwt, {
      expiresIn: '2d',
    });

    await user.save();

    this.mailService.emailConfirm(user);

    return user;
  }

  async updateUserName(username: string, id: string): Promise<User> {
    const user = await this.getUserById(id);

    if (user.username === username) {
      throw new Error('cannot rename same username');
    }

    user.username = username;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('username already exists');
      }
      throw new Error(error);
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

  async updateUserPass(dto: UpdateUserPasswordDTO, id: string): Promise<User> {
    const { password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new Error('password does not match');
    }

    const user = await this.getUserById(id);

    if (password === user.password) {
      throw new Error('please try a different password');
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

  async updateUserRole(role: UserRole, id: string): Promise<User> {
    const user = await this.getUserById(id);

    if (user.role === role) {
      throw new Error('no changes made');
    }

    user.role = role;

    try {
      await user.save();
    } catch (error) {
      throw new Error(error);
    }

    return user;
  }

  async updateUserStatus(status: UserStatus, id: string): Promise<User> {
    const user = await this.getUserById(id);

    if (user.status === UserStatus.notRegistered) {
      throw new Error('user not registered');
    }
    if (user.status === status) {
      throw new Error(status);
    }

    user.status = status;
    if (status === UserStatus.disabled) {
      user.disabledAt = new Date().toUTCString();
    }

    try {
      await user.save();
    } catch (error) {
      throw new Error(error);
    }

    return user;
  }
}
