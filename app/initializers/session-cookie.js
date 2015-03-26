export default {
  name: 'session-cookie',
  after: ['cookie'],

  initialize (container, app) {

    app.inject('controller', 'cookie', 'cookie:main');
    app.inject('route', 'cookie', 'cookie:main');
    app.inject('torii-adapter', 'cookie', 'cookie:main');
  }
};
