import { Client } from 'amazon-api-gateway-client'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

/**
 * @class
 */
export default class Composer {
  /**
   * @param {String} accessKeyId
   * @param {Client=} client
   * @param {String} region
   * @param {String} secretAccessKey
   * @param {String} swaggerFilePath
   */
  constructor({ accessKeyId, client, region, secretAccessKey, swaggerFilePath }) {
    this.accessKeyId = accessKeyId;
    this.client = client;
    this.region = region;
    this.secretAccessKey = secretAccessKey;
    this.swaggerFilePath = swaggerFilePath;
  }

  /**
   * @param {String} httpMethod
   * @param {Object} methodSchema
   * @param {Stirng} resourceId
   * @param {Stirng} restapiId
   * @return {Promise}
   */
  createMethodSet({ httpMethod, methodSchema, resourceId, restapiId }) {
    return this.getClient().putMethod({
      httpMethod: httpMethod,
      resourceId: resourceId,
      restapiId: restapiId
    }).then(() => {
      return this.getClient().putIntegration({
        httpMethod: httpMethod,
        integrationHttpMethod: methodSchema['x-amazon-apigateway-integration']['httpMethod'],
        resourceId: resourceId,
        restapiId: restapiId,
        type: methodSchema['x-amazon-apigateway-integration']['type'] == 'http' ? 'HTTP' : 'LAMBDA',
        uri: methodSchema['x-amazon-apigateway-integration']['uri'],
      });
    }).then(() => {
      return this.getClient().putMethodResponse({
        httpMethod: httpMethod,
        resourceId: resourceId,
        restapiId: restapiId,
        statusCode: 200
      });
    }).then(() => {
      return this.getClient().putIntegrationResponse({
        httpMethod: httpMethod,
        resourceId: resourceId,
        restapiId: restapiId,
        statusCode: 200
      });
    });
  }

  /**
   * @param {Object} methodsMap
   * @param {Stirng} path
   * @param {Stirng} restapiId
   * @return {Promise}
   */
  createMethods({ methodsMap, path, restapiId }) {
    return this.getClient().findResourceByPath({
      path: path,
      restapiId: restapiId
    }).then((resource) => {
      return Promise.all(
        Object.keys(methodsMap).map((method) => {
          return this.createMethodSet({
            httpMethod: method,
            methodSchema: methodsMap[method],
            resourceId: resource.source.id,
            restapiId: restapiId
          })
        })
      );
    });
  }

  /**
   * @param {String} restapiId
   * @return {Promise}
   */
  createResourceSets({ restapiId }) {
    return this.getClient().createResources({
      paths: this.getPaths(),
      restapiId: restapiId
    }).then(() => {
      const pathsMap = this.getPathsMap();
      return Promise.all(
        Object.keys(pathsMap).map((path) => {
          return this.createMethods({
            methodsMap: pathsMap[path],
            path: path,
            restapiId: restapiId
          });
        })
      );
    });
  }

  /**
   * @return {Promise}
   */
  createRestapi() {
    return this.getClient().createRestapi({
      name: this.getSwagger().info.title
    });
  }

  /**
   * @param {String} restapiId
   * @return {Promise}
   */
  deleteDefaultModels({ restapiId }) {
    return Promise.all(
      [
        'Empty',
        'Error'
      ].map((modelName) => {
        return this.getClient().deleteModel({
          modelName: modelName,
          restapiId: restapiId
        });
      })
    );
  }

  /**
   * Set up Amazon Lambda functions and API Gateway endpoints.
   * @return {Promise}
   */
  deploy() {
    return this.createRestapi().then((restapi) => {
      return this.deleteDefaultModels({
        restapiId: restapi.source.id
      });
    }).then(() => {
      return this.createResourceSets({
        restapiId: restapi.source.id
      });
    });
  }

  /**
   * @return {Client}
   */
  getClient() {
    if (!this.client) {
      this.client = new Client({
        accessKeyId: this.accessKeyId,
        region: this.region,
        secretAccessKey: this.secretAccessKey
      });
    }
    return this.client;
  }

  /**
   * @return {Array.<String>}
   */
  getPaths() {
    const basePath = this.getBasePath();
    return Object.keys(this.getSwagger().paths).map((entrypointPath) => {
      return path.join(basePath, entrypointPath);
    });
  }

  /**
   * @return {Object}
   */
  getPathsMap() {
    const basePath = this.getBasePath();
    const pathsMap = this.getSwagger().paths;
    const map = {};
    Object.keys(pathsMap).forEach((entrypointPath) => {
      map[path.join(basePath, entrypointPath)] = pathsMap[entrypointPath];
    });
    return map;
  }

  /**
   * @param {Function} middleware
   * @param {Object=} options
   * @return {Composer}
   */
  use(middleware, options) {
    return new this.constructor({
      accessKeyId: this.accessKeyId,
      client: this.getClient().use(middleware, options),
      region: this.region,
      secretAccessKey: this.secretAccessKey,
      swaggerFilePath: this.swaggerFilePath
    });
  }

  /**
   * @private
   * @return {String}
   */
  getBasePath() {
    return this.getSwagger().basePath || '/';
  }

  /**
   * @private
   * @return {Object}
   */
  getSwagger() {
    if (!this.swagger) {
      this.swagger = this.parseSwaggerFile();
    }
    return this.swagger;
  }

  /**
   * @private
   * @return {Object}
   */
  parseSwaggerFile() {
    return yaml.safeLoad(fs.readFileSync(this.swaggerFilePath, 'utf8'));
  }
}
