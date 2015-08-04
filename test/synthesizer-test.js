import assert from 'assert'
import { Mock } from 'stackable-fetcher'
import { Composer } from '../src/index'

describe('Composer', () => {
  const composer = new Composer({
    accessKeyId: 'accessKeyId',
    region: 'region',
    secretAcceessKey: 'secretAcceessKey',
    swaggerFilePath: 'examples/swagger.yml'
  }).use(
    Mock,
    {}
  );

  describe('#createResources', () => {
    it('sends requests to create resources', () => {
      assert(
        composer.createResources({
          restapiId: 'restapiId'
        }) instanceof Promise
      );
    });
  });

  describe('#createRestapi', () => {
    it('sends request to create new restapi', () => {
      assert(
        composer.createRestapi() instanceof Promise
      );
    });
  });

  describe('#deleteDefaultModels', () => {
    it('sends requests to delete default models', () => {
      assert(
        composer.deleteDefaultModels({
          restapiId: 'restapiId'
        }) instanceof Promise
      );
    });
  });

  describe('#getPaths', () => {
    it('returns all paths defined in swagger file', () => {
      assert.deepEqual(
        composer.getPaths(),
        [
          '/v1/products',
          '/v1/products/child'
        ]
      );
    });
  });

  describe('#use', () => {
    it('returns new Composer', () => {
      assert(
        composer.use(() => {}) instanceof Composer
      );
    });
  });
});
