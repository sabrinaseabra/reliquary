const AWS = require('aws-sdk-mock');
const fs = require('fs');
const { update } = require('../src/updater');

jest.mock('fs');

describe('Tests for the updating methods', () => {
  beforeAll(() => {
    AWS.mock('SecretsManager', 'updateSecret', (params, callback) => {
      callback(null, {
        SecretString: '{"dev": {"secret1": "d1","secret2": "d2","secret3": "d3"}}',
      });
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.REGION;
  });

  afterAll(() => {
    AWS.restore('SecretsManager');
  });

  it('Should update an secret and write it on the current.json', async (done) => {
    const secret = await update('test', '{"dev": {"secret1": "d1","secret2": "d2","secret3": "d3"}}');

    expect(secret).toBeDefined();

    expect(fs.writeFileSync).toHaveBeenCalled();

    done();
  });

  it('Should throw an error when sending an wrong json', () => {
    expect((done) => {
      update('test', '{"dev": {"secret1": "d1""secret2": "d2","secret3": "d3"}}');
      done();
    }).toThrow();
  });
});
