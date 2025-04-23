import { Entity } from '../entity';

export class NotFoundError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const idsList = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityClass.name} Not Found using ID: ${idsList}`);
    this.name = 'NotFoundError';
  }
}
