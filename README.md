# api-composer
A library to synthesize Amazon API Gateway and Amazon Lambda.

## Install
```
npm install api-composer
```

## Usage
```js
import { Composer } from 'api-composer'

let composer = new Composer({
  accessKeyId: '...',
  region: '...',
  secretAcceessKey: '...',
  swaggerFilePath: '/path/to/swagger.yml'
});

// Returns all paths defined in swagger.yml
composer.getPaths()
```
