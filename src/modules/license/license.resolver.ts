import { Resolver, Query, Mutation, Args, Arg, Info } from 'type-graphql';

import { License } from './license.entity';
import { LicenseService } from './license.service';
import {
  CreateLicenseDTO,
  UpdateLicenseTypeDTO,
  UpdateLicenseDateDTO,
} from './license.dto';
import { IdDTO } from '../../utils/global.dto';

@Resolver(() => License)
export class LicenseResolver {
  constructor(private licenseService: LicenseService) {}

  @Query(() => [License])
  async getLicenses(@Info() info: any): Promise<License[]> {
    return this.licenseService.getLicenses(info);
  }

  @Query(() => License)
  async getLicenseById(
    @Args() { id }: IdDTO,
    @Info() info: any,
  ): Promise<License> {
    return this.licenseService.getLicenseById(id, info);
  }

  @Mutation(() => License)
  async createLicense(@Args() dto: CreateLicenseDTO): Promise<License> {
    return this.licenseService.createLicense(dto);
  }

  @Mutation(() => License)
  async updateLicenseType(
    @Args() dto: UpdateLicenseTypeDTO,
    @Arg('id') id: string,
  ): Promise<License> {
    return this.licenseService.updateLicenseType(dto, id);
  }

  @Mutation(() => License)
  async updateLicenseDate(
    @Args() dto: UpdateLicenseDateDTO,
    @Arg('id') id: string,
  ): Promise<License> {
    return this.licenseService.updateLicenseDate(dto, id);
  }
}
