import Ember from "ember";

const { $, run } = Ember;

export default Ember.Service.extend({

  init() {
    this._super(...arguments);
    this.setupMouseEventsFromIframe();
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
