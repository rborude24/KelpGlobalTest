const { Pool } = require('pg');
const { insertDataIntoUsersTable, getDataFromDB } = require('../postgres-db-service');

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('insertDataIntoUsersTable', () => {
  it('should insert data into users table', async () => {
    const mClient = new Pool();
    mClient.query.mockResolvedValueOnce({ rows: [], rowCount: 1 });
    const actualValue = await insertDataIntoUsersTable([{ name: 'John Doe', age: 30, address: null, additional_info: null }]);
    expect(actualValue).toEqual({ success: true});
    expect(mClient.query).toHaveBeenCalledTimes(2);
  });
});

describe('getDataFromDB', () => {
  it('should get data from db', async () => {
    const mClient = new Pool();
    const mResult = { rows: [{ id: 1 }], rowCount: 1 };
    mClient.query.mockResolvedValueOnce(mResult);
    const actualValue = await getDataFromDB('SELECT * FROM users');
    expect(actualValue).toEqual({ success: true, data: [{ id: 1 }] });
    expect(mClient.query).toHaveBeenCalledWith('SELECT * FROM users');
  });
});
