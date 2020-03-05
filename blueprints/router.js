import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: 'none',
  rootURL: config.rootURL
});

Router.map(function() {
});

export default Router;
