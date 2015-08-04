import assert from 'assert'
import { Mock } from 'stackable-fetcher'
import { Synthesizer } from '../src/index'

describe('Synthesizer', () => {
  const synthesizer = new Synthesizer({
    accessKeyId: 'accessKeyId',
    region: 'region',
    secretAcceessKey: 'secretAcceessKey',
    swaggerFilePath: 'examples/swagger.yml'
  }).use(
    Mock,
    {}
  );

  describe('#createRestapi', () => {
    it('sends request to create new restapi', () => {
      assert(
        synthesizer.createRestapi() instanceof Promise
      );
    });
  });

  describe('#deleteDefaultModels', () => {
    it('sends requests to delete default models', () => {
      assert(
        synthesizer.deleteDefaultModels({
          restapiId: 'restapiId'
        }) instanceof Promise
      );
    });
  });

  describe('#getPaths', () => {
    it('returns all paths defined in swagger file', () => {
      assert.deepEqual(
        synthesizer.getPaths(),
        [
          '/v1/products',
          '/v1/products/child'
        ]
      );
    });
  });

  describe('#use', () => {
    it('returns new Synthesizer', () => {
      assert(
        synthesizer.use(() => {}) instanceof Synthesizer
      );
    });
  });
});
