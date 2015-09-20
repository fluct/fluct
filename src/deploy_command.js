import AWS from 'aws-sdk'
import Application from './application'
import BaseCommand from './base_command'
import Composer from './composer'
import { Client } from 'amazon-api-gateway-client'

/**
 * @class
 */
export default class DeployCommand extends BaseCommand {
  run() {
    new Composer({
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      application: new Application()
    })
      .on('deploymentCreated', ({ restapiId, region, stageName }) => {
        console.log(`Deployed: https://${restapiId}.execute-api.${region}.amazonaws.com/${stageName}`);
      })
      .on('functionUploaded', ({ functionName }) => {
        console.log(`Uploaded function: ${functionName}`);
      })
      .on('methodSetUpdated', ({ httpMethod, path }) => {
        console.log(`Updated endpoint: ${httpMethod} ${path}`);
      })
      .on('restapiCreated', ({ restapiId }) => {
        console.log(`Created restapi: ${restapiId}`);
      })
      .on('zipFileCreated', ({ zipPath }) => {
        console.log(`Created zip: ${zipPath}`);
      })
      .deploy()
      .catch((error) => {
        console.log(error.stack);
      });
  }
}
