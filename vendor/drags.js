// This code originally taken from http://codepen.io/pprice/pen/splkc/
(function($) {
  $.fn.drags = function(opt) {

    if (opt === "destroy") {
      destroyFn(this);
      return;
    }

    opt = $.extend({ handle:"",pane:"",cursor:"col-resize", min: 25, minWidth: 200 }, opt);

    var $el;
    if(opt.handle === "") {
      $el = this;
    } else {
      $el = this.find(opt.handle);
    }

    var priorCursor = $('body').css('cursor');
    var drg_w, pos_x, z_idx;

    function mouseDownFn(e) {
      priorCursor = $('body').css('cursor');
      $('body').css('cursor', opt.cursor);

      var $drag;
      if(opt.handle === "") {
        $drag = $(this).addClass('draggable');
      } else {
        $drag = $(this).addClass('active-handle').parent().addClass('draggable');
      }
      z_idx = $drag.css('z-index');
      //drg_h = $drag.outerHeight();
      drg_w = $drag.outerWidth();
      //pos_y = $drag.offset().top + drg_h - e.pageY;
      pos_x = $drag.offset().left + drg_w - e.pageX;
      $drag.css('z-index', 1000);

      $(window).on("mousemove", mouseDragFn);
      $(window).on("mouseup", mouseUpFn);

      e.preventDefault(); // disable selection
    }

    function mouseDragFn(e) {
      var prev = $('.draggable').prev();
      var next = $('.draggable').next();

      // Assume 50/50 split between prev and next then adjust to
      // the next X for prev

      var total = prev.outerWidth() + next.outerWidth();
      var leftFlexGrow = parseFloat(prev.css('flex-grow'));

      if (leftFlexGrow === 0) {
        leftFlexGrow = prev.outerWidth() / next.outerWidth();
      }

      var totalFlex =  leftFlexGrow + parseFloat(next.css('flex-grow'));
      var leftWidth = (e.pageX - prev.offset().left) + (pos_x - drg_w / 2);
      var leftPercentage = leftWidth / total;
      var rightPercentage = 1 - leftPercentage;

      if(leftWidth <= opt.minWidth || leftPercentage * 100 < opt.min || rightPercentage * 100 < opt.min)
      {
        return;
      }

      leftPercentage *= totalFlex;
      rightPercentage *= totalFlex;

      prev.css('flex', leftPercentage.toString());
      next.css('flex', rightPercentage.toString());
    }

    function mouseUpFn(e) {
      $('body').css('cursor', priorCursor);
      $(window).off("mousemove", mouseDragFn);
      $(window).off("mouseup", mouseUpFn);
      $('.draggable').removeClass('draggable').css('z-index', z_idx);
    }

    function destroyFn($el) {
      $el.off("mousedown", mouseDownFn);
    }

    $el.css('cursor', opt.cursor);
    $el.on('mousedown', mouseDownFn);

    return $el;
  };
})(jQuery);
