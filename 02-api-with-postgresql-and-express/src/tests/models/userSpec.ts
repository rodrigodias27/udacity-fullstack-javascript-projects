import client from '../../database';
import { User, UserStore } from '../../models/user';

const store = new UserStore()

describe('Product Model', () => {

  beforeEach(async () => {
    // Setup: create a user
    await store.create({
      id: 1,
      first_name: 'Doctor',
      last_name: 'Who',
      password_digest: '',
      role: 'admin',
    },
    'Trenzalore');
  });

  afterEach(async () => {
    // Clean table users
    const conn = await client.connect();
    const sql = 'TRUNCATE TABLE users cascade;' +
      'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    const result = await conn.query(sql);
    conn.release();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a user', async () => {
    // Act
    const result = await store.create({
      id: 2,
      first_name: 'Clara',
      last_name: 'Oswald',
      password_digest: '',
      role: 'user',
    },
    'Trenzalore')
    // Assert
    expect(result.id).toEqual(2)
    expect(result.first_name).toEqual('Clara')
    expect(result.last_name).toEqual('Oswald')
    expect(result.password_digest).toBeDefined()
    expect(result.role).toEqual('user')
  });

  it('create method should throw an error if first_name and last_name already exists', async () => {
    // Act and Assert
    expectAsync(store.create({
      id: 2,
      first_name: 'Doctor',
      last_name: 'Who',
      password_digest: '',
      role: 'user',
    },
    'Trenzalore')).toBeRejected()
  });

  it('index method should return a list of users', async () => {
    // Act
    const result = await store.index();
    // Assert
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(1)
    expect(result[0].first_name).toEqual('Doctor')
    expect(result[0].last_name).toEqual('Who')
    expect(result[0].password_digest).toBeDefined()
    expect(result[0].role).toEqual('admin')
  });

  it('show method should return the correct user', async () => {
    // Act
    const result = await store.show("1");
    // Assert
    expect(result.id).toEqual(1)
    expect(result.first_name).toEqual('Doctor')
    expect(result.last_name).toEqual('Who')
    expect(result.password_digest).toBeDefined()
    expect(result.role).toEqual('admin')
  });

  it('update method should update a user', async () => {
    // Act
    const result = await store.update({
      id: 1,
      first_name: 'Missy',
      last_name: 'The Master',
      password_digest: '',
      role: 'admin',
    },
    'mellifluous');
    // Assert
    expect(result.id).toEqual(1)
    expect(result.first_name).toEqual('Missy')
    expect(result.last_name).toEqual('The Master')
    expect(result.password_digest).toBeDefined()
    expect(result.role).toEqual('admin')
  });

  it('authenticate method should return user if password is correct', async () => {
    // Act
    const result = await store.authenticate(
      'Doctor',
      'Who',
      'Trenzalore'
    )
    // Assert
    expect(result).toBeDefined()
    const user = result as unknown as User
    expect(user.id).toEqual(1)
    expect(user.first_name).toEqual('Doctor')
    expect(user.last_name).toEqual('Who')
    expect(user.password_digest).toBeDefined()
    expect(user.role).toEqual('admin')
  });

  it('authenticate method should return null if password is not correct', async () => {
    // Act
    const result = await store.authenticate(
      'Doctor',
      'Who',
      'Gallifrey'
    )
    // Assert
    expect(result).toBeNull()
  });

  it('delete method should remove the user', async () => {
    // Act
    await store.delete('1');
    const result = await store.show('1')
    // Assert
    expect(result).toBeUndefined();
  });
})
