import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

/**
 * @class
 */
export default class Synthesizer {
  /**
   * @param {String} accessKeyId
   * @param {String} region
   * @param {String} secretAcceessKey
   * @param {String} swaggerFilePath
   */
  constructor({ accessKeyId, region, secretAcceessKey, swaggerFilePath }) {
    this.accessKeyId = accessKeyId;
    this.region = region;
    this.secretAcceessKey = secretAcceessKey;
    this.swaggerFilePath = swaggerFilePath;
  }

  /**
   * @return {Array.<String>}
   */
  getPaths() {
    const basePath = this._getBasePath();
    return Object.keys(this._getSwagger().paths).map((entrypointPath) => {
      return path.join(basePath, entrypointPath);
    });
  }

  /**
   * @return {String}
   */
  _getBasePath() {
    return this._getSwagger().basePath || '';
  }

  /**
   * @private
   * @return {Object}
   */
  _getSwagger() {
    if (!this._swagger) {
      this._swagger = this._parseSwaggerFile();
    }
    return this._swagger;
  }

  /**
   * @private
   * @return {Object}
   */
  _parseSwaggerFile() {
    return yaml.safeLoad(fs.readFileSync(this.swaggerFilePath, 'utf8'));
  }
}
