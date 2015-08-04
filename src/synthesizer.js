/**
 * @class
 */
export default class Synthesizer {
  /**
   * @param {String} accessKeyId
   * @param {String} region
   * @param {String} secretAcceessKey
   */
  constructor({ accessKeyId, region, secretAcceessKey }) {
    this.accessKeyId = accessKeyId;
    this.region = region;
    this.secretAcceessKey = secretAcceessKey;
  }
}
