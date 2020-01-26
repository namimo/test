import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import moment from 'moment';
import { isEqual } from 'lodash';

import { License } from './license.entity';
import { Repository, QueryRunner } from 'typeorm';
import {
  CreateLicenseDTO,
  UpdateLicenseTypeDTO,
  UpdateLicenseDateDTO,
} from './license.dto';
import nPlus1 from '../../utils/nPlus1';

@Service()
export class LicenseService {
  queryRunner: QueryRunner;
  constructor(
    @InjectRepository(License)
    private licenseRepo: Repository<License>,
  ) {
    this.queryRunner = this.licenseRepo.manager.connection.createQueryRunner();
  }

  async getLicenses(info: any): Promise<License[]> {
    const relations = nPlus1(info, ['user']);
    return this.licenseRepo.find({ relations });
  }

  async getLicenseById(id: string, info?: any): Promise<License> {
    const relations = info ? nPlus1(info, ['user']) : undefined;
    const license = await this.licenseRepo.findOne({
      where: [{ id }],
      relations,
    });

    if (!license) {
      throw new Error('license not found');
    }
    return license;
  }

  async createLicense(dto: CreateLicenseDTO): Promise<License> {
    const { name, schema } = dto;

    const license = new License();
    license.name = name;
    license.schema = schema.toLowerCase();

    try {
      if (await this.queryRunner.hasSchema(license.schema)) {
        throw new Error('schema already exists');
      }
      await license.save();
      await this.queryRunner.createSchema(license.schema);
    } catch (err) {
      if (err.code === '23505') {
        throw new Error(err.detail);
      }
      throw new Error(err);
    }

    return license;
  }

  async updateLicenseType(
    dto: UpdateLicenseTypeDTO,
    id: string,
  ): Promise<License> {
    const { name, web, app, type } = dto;
    const license = await this.getLicenseById(id);

    const curValue = {
      name: license.name,
      web: license.web,
      app: license.app,
      type: license.type,
    };
    const nextValue = {
      name,
      web,
      app,
      type,
    };

    if (isEqual(curValue, nextValue)) {
      throw new Error('no changes made');
    }

    license.name = name;
    license.web = web;
    license.app = app;
    license.type = type;

    try {
      await license.save();
    } catch (error) {
      throw new Error(error);
    }

    return license;
  }

  async updateLicenseDate(
    dto: UpdateLicenseDateDTO,
    id: string,
  ): Promise<License> {
    const { month, type } = dto;

    const license = await this.getLicenseById(id);

    const days = month * 30;
    let date = moment(license.validTill);
    date = type ? date.add(days, 'days') : date.subtract(days, 'days');
    license.validTill = date.format('YYYY-MM-DD');

    try {
      await license.save();
    } catch (error) {
      throw new Error(error);
    }

    return license;
  }
}
