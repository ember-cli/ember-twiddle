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

  setupMouseEventsFromIframe() {
    window.addEventListener('message', (m) => {
      run(() => {
        if(typeof m.data==='object' && 'mousemove' in m.data) {
          let event = $.Event("mousemove", {
            pageX: m.data.mousemove.pageX + $("#dummy-content-iframe").offset().left,
            pageY: m.data.mousemove.pageY + $("#dummy-content-iframe").offset().top
          });
          $(window).trigger(event);
        }
        if(typeof m.data==='object' && 'mouseup' in m.data) {
          let event = $.Event("mouseup", {
            pageX: m.data.mouseup.pageX + $("#dummy-content-iframe").offset().left,
            pageY: m.data.mouseup.pageY + $("#dummy-content-iframe").offset().top
          });
          $(window).trigger(event);
        }
      });
    });
  }

});
