import GistSerializer from './gist';

export default GistSerializer.extend({
  init() {
    this._super(...arguments);
    this.set('include', ['owner', 'files']);
  }
});
