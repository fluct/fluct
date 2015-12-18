#!/usr/bin/env node

import program from 'commander'
import DeployCommand from '../lib/deploy_command'
import DeploymentsCommand from '../lib/deployments_command'
import GenerateCommand from '../lib/generate_command'
import NewCommand from '../lib/new_command'
import OpenCommand from '../lib/open_command'
import RoutesCommand from '../lib/routes_command'
import ServerCommand from '../lib/server_command'

program
  .command('d')
  .alias('deploy')
  .description('Deploy actions to AWS')
  .action((command) => {
    new DeployCommand().run();
  });

program
  .command('l')
  .alias('deployments')
  .description('List recent deployments')
  .action((command) => {
    new DeploymentsCommand().run();
  });

program
  .command('g')
  .alias('generate')
  .arguments('<name>')
  .description('Generate a new resource from <generator> (e.g. "action")')
  .action((name, command) => {
    new GenerateCommand({ name: name }).run()
  });

program
  .command('n')
  .alias('new')
  .arguments('<name>')
  .description('Generate a new application')
  .action((name, command) => {
    new NewCommand({ name: name }).run()
  });


program
  .command('o')
  .alias('open')
  .description('Open the production root URL in your browser')
  .action((command) => {
    new OpenCommand().run();
  });

program
  .command('r')
  .alias('routes')
  .description('List all routes')
  .action((command) => {
    new RoutesCommand().run();
  });

program
  .command('s')
  .alias('server')
  .description('Launch a web server')
  .option('-p, --port <number>', 'Run server on the specified port (default: 3000)')
  .action((command) => {
    new ServerCommand({ port: command.port }).run();
  });

program.parse(process.argv);
