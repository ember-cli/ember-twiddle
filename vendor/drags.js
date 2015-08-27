// This code originally taken from http://codepen.io/pprice/pen/splkc/
(function($) {
  $.fn.drags = function(opt) {

    opt = $.extend({handle:"",pane:"",cursor:"col-resize", min: 25}, opt);

    var $el;
    if(opt.handle === "") {
      $el = this;
    } else {
      $el = this.find(opt.handle);
    }

    var priorCursor = $('body').css('cursor');

    return $el.css('cursor', opt.cursor).on("mousedown", function(e) {

      priorCursor = $('body').css('cursor');
      $('body').css('cursor', opt.cursor);

      var $drag;
      if(opt.handle === "") {
        $drag = $(this).addClass('draggable');
      } else {
        $drag = $(this).addClass('active-handle').parent().addClass('draggable');
      }
      var z_idx = $drag.css('z-index'),
      //drg_h = $drag.outerHeight(),
        drg_w = $drag.outerWidth(),
      //pos_y = $drag.offset().top + drg_h - e.pageY,
        pos_x = $drag.offset().left + drg_w - e.pageX;
      $drag.css('z-index', 1000);
      $(window).on("mousemove", function(e) {

        var prev = $('.draggable').prev();
        var next = $('.draggable').next();

        // Assume 50/50 split between prev and next then adjust to
        // the next X for prev

        var total = prev.outerWidth() + next.outerWidth();
        var totalFlex = parseFloat(prev.css('flex-grow')) + parseFloat(next.css('flex-grow'));

        var leftPercentage = (((e.pageX - prev.offset().left) + (pos_x - drg_w / 2)) / total);
        var rightPercentage = 1 - leftPercentage;

        if(leftPercentage * 100 < opt.min || rightPercentage * 100 < opt.min)
        {
          return;
        }

        leftPercentage *= totalFlex;
        rightPercentage *= totalFlex;

        prev.css('flex', leftPercentage.toString());
        next.css('flex', rightPercentage.toString());
      });

      $(window).on("mouseup", function() {
        $('body').css('cursor', priorCursor);
        $(window).off("mousemove");
        $('.draggable').removeClass('draggable').css('z-index', z_idx);
      });
      e.preventDefault(); // disable selection
    });

  };
})(jQuery);
