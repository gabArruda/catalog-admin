import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Config } from '../config';

export function setupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;
  beforeAll(() => {
    _sequelize = new Sequelize({
      ...Config.db(),
      ...options,
    });
  });

  beforeEach(async () => _sequelize.sync({ force: true }));

  afterAll(async () => _sequelize.close());

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
