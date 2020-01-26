import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Schema } from './schema.entity';
import {
  Connection,
  getConnection,
  QueryRunner,
  // createConnection,
  Repository,
} from 'typeorm';
// import fs from 'fs';

@Service()
export class SchemaService {
  connection: Connection;
  queryRunner: QueryRunner;
  constructor(
    @InjectRepository(Schema)
    private schemaRepo: Repository<Schema>,
  ) {
    this.connection = getConnection();
    this.queryRunner = this.connection.createQueryRunner();
  }
  async getSchemas(): Promise<Schema[]> {
    return this.schemaRepo.find();
  }

  async getLatest(): Promise<Schema> {
    const schema = await this.schemaRepo.findOne({ version: 1 });
    if (!schema) {
      throw new Error('no schemas');
    }

    return schema;
  }

  async deleteSchema(): Promise<boolean> {
    return false;
  }

  // async checkSchema(name: string): Promise<boolean> {
  //   console.log(this.schemaRepo);
  //   return await this.queryRunner.hasSchema(name);
  // }

  // async createSchema(name: string): Promise<void> {
  //   try {
  //     // await this.generateNewMigrations(name);
  //     await this.queryRunner.createSchema(name);
  //     await this.migrateSchema(name, true);
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }

  // async migrateSchema(name: string, type: boolean): Promise<void> {
  //   const conn = await createConnection({
  //     name: 'development',
  //     type: 'postgres',
  //     host: 'localhost',
  //     port: 5432,
  //     username: 'postgres',
  //     password: 'junglee',
  //     database: 'rewise',
  //     schema: name,
  //     synchronize: false,
  //     logging: false,
  //     dropSchema: false,
  //     entities: ['src/modules/**/*.entity.ts'],
  //     migrations: [`src/migrationSchema/${name}/**/*.ts`],
  //     subscribers: ['src/subscriber/**/*.ts'],
  //   });

  //   try {
  //     if (type) {
  //       await conn.runMigrations();
  //     }
  //     if (!type) {
  //       await conn.undoLastMigration();
  //     }
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  //   await conn.close();
  // }

  // async generateNewMigrations(name: string): Promise<void> {
  //   const migrationPath = __dirname + '/../modules/migration';
  //   console.log(migrationPath);
  //   console.log(fs.existsSync(migrationPath));
  //   if (!fs.existsSync(migrationPath)) {
  //     throw new Error('migrations does not exits');
  //   }

  //   try {
  //     await this.deleteOldMigrations(name);
  //   } catch (err) {
  //     throw new Error(err);
  //   }

  //   const files = fs.readdirSync(migrationPath);
  //   if (files.length === 0) {
  //     throw new Error('migration files does not exist');
  //   }

  //   files.forEach(fileName => {
  //     const filePath = migrationPath + fileName;
  //     const data = fs
  //       .readFileSync(filePath, 'utf8')
  //       .replace(/expmalker/g, name);

  //     const schemaPath = migrationPath + `Schema/${name}/`;
  //     console.log(schemaPath);
  //     fs.writeFileSync(schemaPath + fileName, data, 'utf8');
  //   });
  // }

  // async deleteOldMigrations(name: string): Promise<void> {
  //   const schemaPath = __dirname + `/../../migrationSchema/${name}/`;
  //   if (!fs.existsSync(schemaPath)) {
  //     fs.mkdirSync(schemaPath);
  //   }

  //   const files = fs.readdirSync(schemaPath);
  //   files.forEach(fileName => {
  //     fs.unlinkSync(schemaPath + fileName);
  //   });
  // }

  // async renameSchema(name: string, newName: string): Promise<void> {
  //   const schema = await this.checkSchema(name);
  //   if (!schema) {
  //     throw new Error('schema not found');
  //   }

  //   await this.connection.query(`ALTER SCHEMA ${name} TO ${newName}`);
  // }
}
