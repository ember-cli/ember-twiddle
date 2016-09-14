import Ember from 'ember';

const { inject } = Ember;

export default Ember.Component.extend({
  resizeableColumns: inject.service('resizeable-columns'),
  classNames: ['row', 'twiddle-panes'],

  init() {
    this._super(...arguments);
    this.get('resizeableColumns'); // ensure service created
  },

  didRender() {
    this._super(...arguments);
    if (!this.get('media.isMobile')) {
      this.$('.twiddle-pane.code, .twiddle-pane.output').after('<div class="handle"></div>');
      this.$('.handle').last().remove();
      this.$('.handle').drags({ pane: '.twiddle-pane.code, .twiddle-pane.output' });
    }
  },

  willUpdate() {
    this.cleanupDrags();
  },

  willDestroyElement() {
    this.cleanupDrags();
  },

  cleanupDrags() {
    this.$('.handle').drags("destroy");
    this.$('.handle').remove();
  }
});
