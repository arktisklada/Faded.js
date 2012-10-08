/*********************************************************************************
Faded.js
Version 0.1a
http://fadedjs.com

By Clayton Liggitt (mail@enorganik.com)
http://github.org/arktisklada

Requres jQuery 1.4.0 or newer

Faded.js is provided under the MIT or GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html

Copyright (c) 2012 Clayton Liggitt (Arktisklada)


Sample usage: $('a').faded();

Available options: {
	delayIn: 0					// delay before fading in (ms)			[0]
	delayOut: 0					// delay before fading out (ms)			[0]
	duration: 200				// duration of fade						[200]
	fade: true					// fade or basic swap 					[true]
	live: false					// event bindings are live vs bind 		[false]
	allowPropagation: false		// allow event propagation / bubbling 	[false]
};
*********************************************************************************/


(function($) {
	
	function Faded(el, o) {
		this.self = $(el);
		this.o = o;
		this.setup();
		return this;
	};
	
	Faded.prototype = {
		setup: function() {
			if(this.faded !== true) {
				var self = this.self;
				
				var pos = self.css('position');
				if(pos != 'absolute' || pos != 'relative' || pos != 'fixed') {
					self.css({position: 'relative'});
				}
				
				var off = '<span class="faded-off">' + self.html() + '</span>';
				var on = '<span class="faded-on">' + self.html() + '</span>';
				self.html(off + on);
				
				this.on = self.children('.faded-on');

				this.on.css({display: 'none', 
					position: 'absolute', 
					top: '0px', 
					left: '0px', 
					height: self.height(), 
					width: self.width(), 
					textIndent: self.css('text-indent'), 
					backgroundImage: self.css('background-image'), 
					backgroundPosition: 'bottom left'
				});
				
				this.faded = true;
			}
		},
		
		show: function() {
			if(this.o['fade']) {
				this.on.stop().fadeTo(this.o['duration'], 1);
			} else {
				this.on.show();
			}
		},
		
		hide: function() {
			if(this.o['fade']) {
				this.on.stop().fadeTo(this.o['duration'], 0);
			} else {
				this.on.hide();
			}
		}
	};
	
	$.fn.faded = function(o) {
		
		o = $.extend({}, $.fn.faded.defaults, o);
		
		function get(el) {
			var f = $.data(el, 'faded');
			if(!f) {
				f = new Faded(el, o);
				$.data(el, 'faded', f);
			}
			return f;
		}
		
		function enter(e) {
			if(!o.allowPropagation) {
				e.stopPropagation();
			}
			f = get(this);
			f.state = 'on';
			if(o.delayIn == 0) {
				f.show();
			} else {
				setTimeout(function() { 
					if(f.state == 'on') {
						f.show();
					}
				}, o.delayIn);
			}
		};
		
		function leave(e) {
			if(!o.allowPropagation) {
				e.stopPropagation();
			}
			f = get(this);
			f.state = 'off';
			if(o.delayOut == 0) {
				f.hide();
			} else {
				setTimeout(function() {
					if(f.state == 'off') {
						f.hide();
					}
				}, o.delayOut);
			}
		};
		
		if(!o.live) {
			this.each(function() {
				$.data(this, 'faded', new Faded(this, o));
			});
		}
		
		if(o.trigger != 'manual') {
			var binder   = o.live ? 'live' : 'bind';
			this[binder]('mouseenter', enter)[binder]('mouseleave', leave);
		}
		
		return this;
	};
	
	$.fn.faded.defaults = {
		delayIn: 0,
		delayOut: 0,
		duration: 200,
		fade: true,
		live: false,
		allowPropagation: false
	};
	
})(jQuery);
