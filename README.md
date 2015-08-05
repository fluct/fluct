# api-composer
A library to synthesize Amazon API Gateway and Amazon Lambda.

## Install
```
npm install api-composer
```

## Usage
`Composer#deploy` creates resources on API Gateway from your swagger file.

```js
import { Composer } from 'api-composer'

new Composer({
  accessKeyId: '...',
  region: '...',
  secretAcceessKey: '...',
  swaggerFilePath: '/path/to/swagger.yml'
}).deploy();
```
