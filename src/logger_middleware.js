export default class LoggerMiddleware {
  constructor(application) {
    this.application = application;
  }

  call(environment) {
    console.log((environment.method + '     ').substr(0, 7) + environment.url);
    return this.application.call(environment);
  }
}
