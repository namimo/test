// import { Service } from 'typedi';
// import { InjectRepository } from 'typeorm-typedi-extensions';
// import { Keys, KeysType } from './keys.entity';
// import { Repository } from 'typeorm';
// import { JwtService } from '../../utils/jwt.service';
// import config from '../../config';

// @Service()
// export class KeysService {
// constructor(
// @InjectRepository(Keys)
// private keysRepo: Repository<Keys>,
// private jwtSerivice: JwtService,
// ) {}

// async getKeys(): Promise<Keys[]> {
// return this.keysRepo.find();
// }

// async createAuthKey(): Promise<Keys> {
// const key = new Keys();
// key.key = this.jwtSerivice.sign(
//   { pass: config.createAuth },
//   config.createAuth,
// );
// key.type = KeysType.auth;

// try {
// await key.save();
// } catch (err) {
// throw new Error(err);
// }

//     return key;
//   }
// }
