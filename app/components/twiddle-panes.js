import Ember from 'ember';

const { inject, run } = Ember;

export default Ember.Component.extend({
  resizeableColumns: inject.service(),
  classNames: ['twiddle-panes'],

  init() {
    this._super(...arguments);
    this.get('resizeableColumns'); // ensure service created
  },

  didRender() {
    this._super(...arguments);
    run.schedule('afterRender', this, this.setupHandles);
  },

  setupHandles() {
    if (!this.get('media.isMobile')) {
      this.$('.twiddle-pane').after('<div class="handle"></div>');
      this.$('.handle').last().remove();
      this.$('.handle').drags({ pane: '.twiddle-pane', min: 20 });
    }
  },

  willUpdate() {
    this.cleanupDrags();
  },

  willDestroyElement() {
    this._super(...arguments);

    this.cleanupDrags();
  },

  cleanupDrags() {
    this.$('.handle').drags("destroy");
    this.$('.handle').remove();
  }
});
