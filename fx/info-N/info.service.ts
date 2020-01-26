import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Info } from './info.entity';
import { Repository } from 'typeorm';

@Service()
export class InfoService {
  constructor(
    @InjectRepository(Info)
    private infoRepo: Repository<Info>,
  ) {}

  async get() {
    console.log(await this.infoRepo.find());
  }
}
