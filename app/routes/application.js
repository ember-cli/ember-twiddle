import Route from '@ember/routing/route';

import JSTree from 'ember-cli-jstree/components/ember-jstree';
JSTree.reopen({
  _setupJsTree() {
    return jQuery(this.element).jstree(this._buildConfig());
  },
})

export default Route.extend({
  title(tokens) {
    return "Ember Twiddle - " + tokens.join(" - ");
  },

  actions: {
    titleUpdated() {
      this.router.updateTitle();
    }
  }
});
