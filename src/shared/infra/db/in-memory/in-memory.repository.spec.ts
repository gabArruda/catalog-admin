import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { ValueObject } from "../../../domain/value-object";
import { Uuid } from "../../../domain/value-objects/uuid.value-object";
import { InMemoryRepository } from "./in-memory.repository";

type StubEntityConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructorProps) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON(): Object {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("In Memory Repository Unit Tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it("should insert a new entity", async () => {
    const entity = new StubEntity({
      name: "Test",
      price: 100,
    });

    await repository.insert(entity);

    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toBe(entity);
  });

  it("should bulk insert new entities", async () => {
    const entities = [
      new StubEntity({
        name: "Test1",
        price: 100,
      }),
      new StubEntity({
        name: "Test2",
        price: 200,
      }),
    ];

    await repository.bulkInsert(entities);
    expect(repository.items.length).toBe(2);
    expect(repository.items[0]).toBe(entities[0]);
    expect(repository.items[1]).toBe(entities[1]);
  });

  describe("update", () => {
    it("should update entity", async () => {
      let entity = new StubEntity({
        name: "Test",
        price: 100,
      });
      await repository.insert(entity);

      entity.price = 300;
      await repository.update(entity);

      expect(repository.items.length).toBe(1);
      expect(repository.items[0].price).toBe(300);
      expect(repository.items[0]).toBe(entity);
    });

    it("should throw when entity is not found", async () => {
      const entity = new StubEntity({
        name: "Test",
        price: 100,
      });

      await expect(repository.update(entity)).rejects.toThrow(NotFoundError);
    });
  });

  describe("delete", () => {
    it("should delete a entity", async () => {
      let entity = new StubEntity({
        name: "Test",
        price: 100,
      });
      await repository.insert(entity);
      expect(repository.items.length).toBe(1);

      await repository.delete(entity.entity_id);

      expect(repository.items.length).toBe(0);
    });

    it("should throw when entity is not found", async () => {
      const entity = new StubEntity({
        name: "Test",
        price: 100,
      });

      await expect(repository.delete(entity.entity_id)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("findById", () => {
    it("should return a entity", async () => {
      let entity = new StubEntity({
        name: "Test",
        price: 100,
      });
      await repository.insert(entity);

      const foundItem = await repository.findById(entity.entity_id);

      expect(foundItem).toBe(entity);
    });

    it("should return null when entity is not found", async () => {
      const entity = new StubEntity({
        name: "Test",
        price: 100,
      });

      const foundItem = await repository.findById(entity.entity_id);
      expect(foundItem).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all entities as an array", async () => {
      const entities = [
        new StubEntity({
          name: "Test1",
          price: 100,
        }),
        new StubEntity({
          name: "Test2",
          price: 200,
        }),
      ];
      await repository.bulkInsert(entities);

      const foundItems = await repository.findAll();

      expect(foundItems).toStrictEqual(entities);
    });

    it("should return an empty array when no entities", async () => {
      const foundItems = await repository.findAll();

      expect(foundItems).toStrictEqual([]);
      expect(foundItems).toHaveLength(0);
    });
  });
});
