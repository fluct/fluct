import Application from './application'
import fs from 'fs'

/**
 * @class
 */
export default class Action {
  /**
   * @param {String} name
   */
  constructor({ application, name }) {
    this.application = application;
    this.name = name;
  }

  /**
   * @return {String}
   * @example 'text/html'
   */
  getContentType() {
    return this.getMetadata().contentType;
  }

  /**
   * @return {String}
   */
  getDirectoryPath() {
    return `./actions/${this.name}`;
  }

  /**
   * @return {String}
   */
  getFunctionArn() {
    return `arn:aws:lambda:${this.application.getRegion()}:${this.application.getAccountId()}:function:${this.getName()}`;
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
    return this.getMetadata().httpMethod;
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
      fs.readFileSync(`${this.getDirectoryPath()}/fluct.json`)
    );
  }

  /**
   * @return {String}
   */
  getPath() {
    return this.getMetadata().path;
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
          "$key": "$util.escapeJavaScript($input.params().header.get($key))"#if( $foreach.hasNext ),#end
      #end
        },
        "httpMethod": "$context.httpMethod",
        "path": "$context.resourcePath",
        "pathParameters": {
      #foreach( $key in $input.params().path.keySet() )
          "$key": "$util.escapeJavaScript($input.params().path.get($key))"#if( $foreach.hasNext ),#end
      #end
        },
        "queryParameters": {
      #foreach( $key in $input.params().querystring.keySet() )
          "$key": "$util.escapeJavaScript($input.params().querystring.get($key))"#if( $foreach.hasNext ),#end
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
    if (this.getMetadata().contentType == 'application/json') {
      return {}
    } else {
      return { 'text/html': "$input.path('$')" }
    }
  }

  /**
   * @return {Integer}
   */
  getStatusCode() {
    return this.getMetadata().statusCode || 200;
  }

  /**
   * @return {Integer}
   */
  getTimeout() {
    return 60;
  }

  /**
   * @return {Integer}
   */
  getMemorySize() {
    return this.getMetadata().memorySize || 128;
  }

  /**
   * @return {String}
   */
  getUri() {
    return `arn:aws:apigateway:${this.application.getRegion()}:lambda:path/2015-03-31/functions/${this.getFunctionArn()}/invocations`;
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
}
