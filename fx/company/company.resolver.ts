import { Resolver, Query, Args, Mutation } from 'type-graphql';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { IdDTO } from '../../utils/global.dto';
import {
  CreateCompanyDTO,
  UpdateCompanyDTO,
  UpdateCompanyStatusDTO,
} from './company.dto';

@Resolver()
export class CompanyResolver {
  constructor(private companyService: CompanyService) {}

  @Query(() => [Company])
  async getCompanies(): Promise<Company[]> {
    return this.companyService.getCompanies();
  }

  @Query(() => Company)
  async getCompanyById(@Args() { id }: IdDTO): Promise<Company> {
    return this.companyService.getCompanyById(id);
  }

  @Mutation(() => Company)
  async createCompany(@Args() dto: CreateCompanyDTO): Promise<Company> {
    return this.companyService.createCompany(dto);
  }

  @Mutation(() => Company)
  async updateCompany(@Args() dto: UpdateCompanyDTO): Promise<Company> {
    return this.companyService.updateCompany(dto, dto.id);
  }

  @Mutation(() => Company)
  async updateCompanyStatus(
    @Args() dto: UpdateCompanyStatusDTO,
  ): Promise<Company> {
    return this.companyService.updateCompanyStatus(dto, dto.id);
  }
}
