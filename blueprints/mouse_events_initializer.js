import jQuery from 'jquery';
import config from '../config/environment';

export default {
  name: 'mouse-events',
  initialize: function() {
    jQuery(window).on("mousemove", function(event) {
      window.parent.postMessage({
        mousemove: {
          pageX: event.pageX,
          pageY: event.pageY
        }
      }, config.TWIDDLE_ORIGIN);
    });
    jQuery(window).on("mouseup", function(event) {
      window.parent.postMessage({
        mouseup: {
          pageX: event.pageX,
          pageY: event.pageY
        }
      }, config.TWIDDLE_ORIGIN);
    });
  }
}
