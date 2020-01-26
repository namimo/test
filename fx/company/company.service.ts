import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Company } from './company.entity';
import { License } from '../license/license.entity';
import { Repository, QueryRunner } from 'typeorm';
import { isEqual } from 'lodash';
import {
  CreateCompanyDTO,
  UpdateCompanyDTO,
  UpdateCompanyStatusDTO,
} from './company.dto';
// import { MailService } from 'src/utils/nodemailer.service';

@Service()
export class CompanyService {
  queryRunner: QueryRunner;
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {
    this.queryRunner = this.companyRepo.manager.connection.createQueryRunner();
  }

  async getCompanies(): Promise<Company[]> {
    return this.companyRepo.find({ relations: ['license'] });
  }

  async getCompanyById(id: string): Promise<Company> {
    const company = await this.companyRepo.findOne(
      { id },
      { relations: ['license'] },
    );
    if (!company) {
      throw new Error('company not found');
    }

    return company;
  }

  async createCompany(dto: CreateCompanyDTO): Promise<Company> {
    const {
      name,
      desc,
      address,
      country,
      contact1,
      contact2,
      email,
      pan,
      schema,
    } = dto;

    if (contact1 === contact2) {
      throw new Error('both contacts have same number');
    }

    const company = new Company();
    const license = new License();

    company.name = name;
    company.desc = desc;
    company.address = address;
    company.country = country;
    company.contact1 = contact1;
    company.contact2 = contact2;
    company.email = email;
    company.pan = pan;
    company.schema = schema;
    company.license = license;

    try {
      if (await this.queryRunner.hasSchema(schema)) {
        throw new Error('schema already exists');
      }
      await company.save();
      await this.queryRunner.createSchema(schema);
    } catch (err) {
      if (err.code === '23505') {
        throw new Error(err.detail);
      }
      throw new Error(err);
    }

    return company;
  }

  async updateCompany(dto: UpdateCompanyDTO, id: string): Promise<Company> {
    const {
      name,
      desc,
      address,
      country,
      contact1,
      contact2,
      email,
      pan,
    } = dto;
    const company = await this.getCompanyById(id);

    const curValue = {
      name: company.name,
      desc: company.desc,
      address: company.address,
      country: company.country,
      contact1: company.contact1,
      contact2: company.contact2,
      email: company.email,
      pan: company.pan,
    };
    const nextValue = {
      name,
      desc,
      address,
      country,
      contact1,
      contact2,
      email,
      pan,
    };
    if (isEqual(curValue, nextValue)) {
      throw new Error('no changes made');
    }

    company.name = name;
    company.desc = desc;
    company.address = address;
    company.country = country;
    company.contact1 = contact1;
    company.contact2 = contact2;
    company.email = email;
    company.pan = pan;

    try {
      await company.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new Error(err.detail);
      }
      throw new Error(err);
    }

    return company;
  }

  async updateCompanyStatus(
    dto: UpdateCompanyStatusDTO,
    id: string,
  ): Promise<Company> {
    const { status } = dto;
    const company = await this.getCompanyById(id);

    if (company.status === status) {
      throw new Error('no changes made');
    }

    company.status = status;

    try {
      await company.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new Error(err.detail);
      }
      throw new Error(err);
    }

    return company;
  }
}
