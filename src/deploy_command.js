import AWS from 'aws-sdk'
import Application from './application'
import BaseCommand from './base_command'
import Composer from './composer'
import InstallCommand from './install_command'
import LoggerMiddleware from './logger_middleware'
import { Client } from 'amazon-api-gateway-client'

/**
 * @class
 */
export default class DeployCommand extends BaseCommand {
  run() {
    new InstallCommand().run().then(() => {
      new Composer({
        accessKeyId: AWS.config.credentials.accessKeyId,
        application: new Application(),
        region: 'us-east-1',
        secretAccessKey: AWS.config.credentials.secretAccessKey
      })
        .use(LoggerMiddleware)
        .deploy()
        .catch((error) => {
          console.log(error.stack);
        });
    });
  }
}
