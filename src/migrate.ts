import { NestFactory } from '@nestjs/core';

import { MigrationsModule } from './nest-modules/database-module/migrations.module';
import { migrator } from '@core/shared/infra/db/sequelize/migrator';
import { getConnectionToken } from '@nestjs/sequelize';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MigrationsModule, {
    logger: ['error'],
  });

  const sequelize = app.get(getConnectionToken());

  await migrator(sequelize).runAsCLI();
}
void bootstrap();
