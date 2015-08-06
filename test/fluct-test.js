import assert from 'assert'
import { Mock } from 'stackable-fetcher'
import { Composer } from '../src/index'

describe('Composer', () => {
  const fluct = new Composer({
    accessKeyId: 'accessKeyId',
    region: 'region',
    secretAcceessKey: 'secretAcceessKey',
    swaggerFilePath: 'examples/swagger.yml'
  }).use(
    Mock,
    {}
  );

  describe('#createResourceSets', () => {
    it('sends requests to create resources', () => {
      assert(
        fluct.createResourceSets({
          restapiId: 'restapiId'
        }) instanceof Promise
      );
    });
  });

  describe('#createRestapi', () => {
    it('sends request to create new restapi', () => {
      assert(
        fluct.createRestapi() instanceof Promise
      );
    });
  });

  describe('#deploy', () => {
    it('sends requests', () => {
      assert(
        fluct.deploy() instanceof Promise
      );
    });
  });

  describe('#deleteDefaultModels', () => {
    it('sends requests to delete default models', () => {
      assert(
        fluct.deleteDefaultModels({
          restapiId: 'restapiId'
        }) instanceof Promise
      );
    });
  });

  describe('#getPaths', () => {
    it('returns all paths defined in swagger file', () => {
      assert.deepEqual(
        fluct.getPaths(),
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
        fluct.use(() => {}) instanceof Composer
      );
    });
  });
});
