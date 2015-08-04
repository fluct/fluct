import assert from 'assert'
import { Synthesizer } from '../src/index'

describe('Synthesizer', () => {
  const synthesizer = new Synthesizer({
    swaggerFilePath: 'examples/swagger.yml'
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
});
