import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { run } from '@ember/runloop';

export default Component.extend({
  resizeableColumns: service(),
  classNames: ['row', 'twiddle-panes'],
  classNameBindings: ['fileTreeShown'],

  init() {
    this._super(...arguments);
    this.resizeableColumns; // ensure service created
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
