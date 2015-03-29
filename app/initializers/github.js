export function initialize( container, application ) {
  application.inject('route', 'github', 'service:github');
  application.inject('torii-adapter', 'github', 'service:github');
}

export default {
  name: 'github',
  initialize: initialize
};
