import { Client } from 'amazon-api-gateway-client'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

/**
 * @class
 */
export default class Synthesizer {
  /**
   * @param {String} accessKeyId
   * @param {Client=} client
   * @param {String} region
   * @param {String} secretAcceessKey
   * @param {String} swaggerFilePath
   */
  constructor({ accessKeyId, client, region, secretAcceessKey, swaggerFilePath }) {
    this.accessKeyId = accessKeyId;
    this.client = client;
    this.region = region;
    this.secretAcceessKey = secretAcceessKey;
    this.swaggerFilePath = swaggerFilePath;
  }

  /**
   * @param {String} restapiId
   * @return {Promise}
   */
  createResources({ restapiId }) {
    return this.getClient().createResources({
      paths: this.getPaths(),
      restapiId: restapiId
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
   * @return {Client}
   */
  getClient() {
    if (!this.client) {
      this.client = new Client({
        accessKeyId: this.accessKeyId,
        region: this.region,
        secretAcceessKey: this.secretAcceessKey
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
   * @param {Function} middleware
   * @param {Object=} options
   * @return {Synthesizer}
   */
  use(middleware, options) {
    return new this.constructor({
      accessKeyId: this.accessKeyId,
      client: this.getClient().use(middleware, options),
      region: this.region,
      secretAcceessKey: this.secretAcceessKey,
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
