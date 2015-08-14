import fs from 'fs'

/**
 * @class
 */
export default class Action {
  /**
   * @param {String} name
   */
  constructor({ name }) {
    this.name = name;
  }

  /**
   * @return {String}
   * @example 'text/html'
   */
  getContentType() {
    return this.getMetadata().fluct.contentType;
  }

  /**
   * @return {String}
   */
  getDirectoryPath() {
    return `./actions/${this.name}`;
  }

  /**
   * @return {Function}
   */
  getHandler() {
    const handlerScriptPath = `${process.cwd()}/${this.getDirectoryPath()}`;
    delete(require.cache[handlerScriptPath]);
    return require(handlerScriptPath).handler;
  }

  /**
   * @return {String}
   */
  getHandlerId() {
    return 'index.handler';
  }

  /**
   * @return {String}
   */
  getHttpMethod() {
    return this.getMetadata().fluct.httpMethod;
  }

  /**
   * @return {String}
   */
  getName() {
    return this.getMetadata().name;
  }

  /**
   * @return {Object}
   */
  getMetadata() {
    return JSON.parse(
      fs.readFileSync(`${this.getDirectoryPath()}/package.json`)
    );
  }

  /**
   * @return {String}
   */
  getPath() {
    return this.getMetadata().fluct.path;
  }

  /**
   * @return {String}
   */
  getRegion() {
    return new Application().getRegion();
  }

  /**
   * @return {Object}
   */
  getRequestTemplates() {
    return {
      'application/json': `
      {
        "accountId": "$context.identity.accountId",
        "apiId": "$context.apiId",
        "apiKey": "$context.identity.apiKey",
        "caller": "$context.identity.caller",
        "headers": {
      #foreach( $key in $input.params().header.keySet() )
          "$key": "$input.params().header.get($key)"#if( $foreach.hasNext ),#end
      #end
        },
        "httpMethod": "$context.httpMethod",
        "path": "$context.resourcePath",
        "pathParameters": {
      #foreach( $key in $input.params().path.keySet() )
          "$key": "$input.params().path.get($key)"#if( $foreach.hasNext ),#end
      #end
        },
        "queryParameters": {
      #foreach( $key in $input.params().querystring.keySet() )
          "$key": "$input.params().querystring.get($key)"#if( $foreach.hasNext ),#end
      #end
        },
        "requestId": "$context.requestId",
        "requestParameters": $input.json('$'),
        "resourceId": "$context.resourceId",
        "sourceIp": "$context.identity.sourceIp",
        "stage": "$context.stage",
        "user": "$context.identity.user",
        "userAgent": "$context.identity.userAgent",
        "userArn": "$context.identity.userArn"
      }`.replace(/^      /gm, '')
    };
  }

  /**
   * @return {Object}
   * @example { 'text/html': 'Empty' }
   */
  getResponseModels() {
    const contentType = this.getContentType();
    const returnedValue = {};
    if (contentType !== 'application/json') {
      returnedValue[contentType] = 'Empty';
    }
    return returnedValue;
  }

  /**
   * @return {Object}
   */
  getResponseTemplates() {
    if (this.getMetadata().fluct.contentType == 'application/json') {
      return {}
    } else {
      return { 'text/html': "$input.path('$')" }
    }
  }

  /**
   * @return {Integer}
   */
  getTimeout() {
    return 60;
  }

  /**
   * @return {String}
   */
  getUri() {
    return `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${this.getMetadata().fluct.arn}/invocations`;
  }

  /**
   * @return {String}
   */
  getZipPath() {
    return `${this.getDirectoryPath()}/lambda.zip`;
  }

  /**
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse} response
   */
  run(request, response) {
    this.getHandler()(
      {},
      {
        succeed: (value) => {
          response.header('Content-Type', this.getContentType());
          response.send(value);
        }
      }
    );
  }

  /**
   * @param {String} arn
   */
  writeArn(arn) {
    const metadata = this.getMetadata();
    metadata.fluct.arn = arn;
    fs.writeSync(
      fs.openSync(`${this.getDirectoryPath()}/package.json`, 'w'),
      JSON.stringify(metadata, null, 2)
    );
  }
}
