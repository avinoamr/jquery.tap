// from: http://benalman.com/news/2010/03/jquery-special-events/
(function($){

    var THRESHOLD_DBL = 500;
    var THRESHOLD_LONG = 1500;
    var elems = 0,
        clicks = 0,
        last,
        timeout;

    $.event.special.tap = 
    $.event.special.dbltap = 
    $.event.special.longtap = {
        setup: function() {
            if (++elems === 1) {
                $(document).bind('touchstart', touch_start);
                $(document).bind('touchend', touch_end);
            }
        },
        teardown: function() {
            if (--elems === 0) {
                $(document).unbind('touchstart', touch_end);
                $(document).bind('touchend', touch_end);
            }
        }
    };
    
    var touch_start = function(ev) {
        last = ev;
        timeout = setTimeout(function() {
            clicks = 0;
            touch_move();
            $(ev.target).trigger('longtap');
        }, THRESHOLD_LONG);
        $(document).one('touchmove', touch_move);
    };

    var touch_end = function(ev) {
        if (last) {
            var elem = $(ev.target);
            if (ev.timeStamp - last.timeStamp > THRESHOLD_DBL) {
                clicks = 0;
            }
            clicks += 1;
            elem.trigger('tap');
            if (clicks == 2) {
                elem.trigger('dbltap');
                clicks = 0;
            }
        }
        touch_move();
    };

    var touch_move = function() {
        last = null;
        $(document).unbind('touchmove', touch_move);
        timeout = clearTimeout(timeout);
    };

})(jQuery);