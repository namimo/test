import { Resolver } from 'type-graphql';
import { KeysService } from './keys.service';

@Resolver()
export class KeysResolver {
  constructor(private keysService: KeysService) {}

  async get() {
    console.log(this.keysService);
  }
}
