# api-synthesizer
A library synthesize Amazon API Gateway and Amazon Lambda.

## Install
```
npm install api-synthesizer
```

## Usage
```js
import { Synthesizer } from 'api-synthesizer'

let synthesizer = new Synthesizer({
  accessKeyId: '...',
  region: '...',
  secretAcceessKey: '...',
  swaggerFilePath: '/path/to/swagger.yml'
});

// Returns all paths defined in swagger.yml
synthesizer.getPaths()
```
