import Ember from "ember";

const { $, inject, run } = Ember;

export default Ember.Service.extend({
  fastboot: inject.service(),

  init() {
    this._super(...arguments);
    if (!this.get('fastboot.isFastBoot')) {
      this.setupMouseEventsFromIframe();
    }
  },

  handleMouseEvents(m, mouseEvent) {
    const event = $.Event(mouseEvent, {
      pageX: m.pageX + $("#dummy-content-iframe").offset().left,
      pageY: m.pageY + $("#dummy-content-iframe").offset().top
    });
    $(window).trigger(event);
  },

  setupMouseEventsFromIframe() {
    window.addEventListener('message', (m) => {
      run(() => {
        if(typeof m.data==='object' && 'mousemove' in m.data) {
          this.handleMouseEvents(m.data.mousemove, 'mousemove');
        }

        if(typeof m.data==='object' && 'mouseup' in m.data) {
          this.handleMouseEvents(m.data.mouseup, 'mousemove');
        }
      });
    });
  }

});
