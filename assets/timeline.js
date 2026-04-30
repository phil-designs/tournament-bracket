jQuery(function($) {
  // Vertical Timeline
	function VerticalTimeline( element ) {
		this.element = element;
		this.blocks = this.element.getElementsByClassName("pd-timeline__block");
		this.images = this.element.getElementsByClassName("pd-timeline__img");
		this.contents = this.element.getElementsByClassName("pd-timeline__content");
		this.offset = 0.8;
		this.hideBlocks();
		// defer line measurement until layout has stabilized
		var self = this;
		if(window.requestAnimationFrame) {
			window.requestAnimationFrame(function(){ self.updateLineWidth(); });
		} else {
			this.updateLineWidth();
		}

		// if this is a horizontal timeline the container itself scrolls horizontally
		// (window scroll won't fire). keep the line size in sync and reveal blocks
		if(this.element.classList.contains('pd-timeline--horizontal')) {
			var container = this.element.querySelector('.pd-timeline__container');
			if(container) {
				container.addEventListener('scroll', function() {
					self.showBlocks();
					self.updateLineWidth();
				});
			}
		}
	};

	VerticalTimeline.prototype.updateLineWidth = function() {
    if(this.element.classList.contains('pd-timeline--horizontal')) {
        var container = this.element.querySelector('.pd-timeline__container');
        var line = this.element.querySelector('.pd-timeline__line');
        if(container && line) {
            // try to compute width based on last block so margins/spacing are included
            var blocks = container.querySelectorAll('.pd-timeline__block');
            var w = 0;
            if(blocks.length) {
                var last = blocks[blocks.length - 1];
                var style = window.getComputedStyle(last);
                var marginRight = parseFloat(style.marginRight) || 0;
                w = last.offsetLeft + last.offsetWidth + marginRight;
            }
            // always fall back to scrollWidth if it's larger
            if(container.scrollWidth > w) {
                w = container.scrollWidth;
            }
            line.style.width = w + 'px';
            // keep the CSS variable too
            container.style.setProperty('--line-width', w + 'px');
        }
    }
};

	VerticalTimeline.prototype.hideBlocks = function() {
		if ( !"classList" in document.documentElement ) {
			return; // no animation on older browsers
		}
		//hide timeline blocks which are outside the viewport
		var self = this;
		for( var i = 0; i < this.blocks.length; i++) {
			(function(i){
				var rect = self.blocks[i].getBoundingClientRect();
				if(self.element.classList.contains('pd-timeline--horizontal')) {
					if( rect.left > window.innerWidth*self.offset ) {
						self.images[i].classList.add("pd-timeline__img--hidden"); 
						self.contents[i].classList.add("pd-timeline__content--hidden"); 
					}
				} else {
					if( rect.top > window.innerHeight*self.offset ) {
						self.images[i].classList.add("pd-timeline__img--hidden"); 
						self.contents[i].classList.add("pd-timeline__content--hidden"); 
					}
				}
			})(i);
		}
	};

	VerticalTimeline.prototype.showBlocks = function() {
		if ( ! "classList" in document.documentElement ) {
			return;
		}
		var self = this;
		for( var i = 0; i < this.blocks.length; i++) {
			(function(i){
				var rect = self.blocks[i].getBoundingClientRect();
				if(self.element.classList.contains('pd-timeline--horizontal')) {
					if( self.contents[i].classList.contains("pd-timeline__content--hidden") && rect.left <= window.innerWidth*self.offset ) {
						self.images[i].classList.add("pd-timeline__img--bounce-in");
						self.contents[i].classList.add("pd-timeline__content--bounce-in");
						self.images[i].classList.remove("pd-timeline__img--hidden");
						self.contents[i].classList.remove("pd-timeline__content--hidden");
					}
				} else {
					if( self.contents[i].classList.contains("pd-timeline__content--hidden") && rect.top <= window.innerHeight*self.offset ) {
						// add bounce-in animation
						self.images[i].classList.add("pd-timeline__img--bounce-in");
						self.contents[i].classList.add("pd-timeline__content--bounce-in");
						self.images[i].classList.remove("pd-timeline__img--hidden");
						self.contents[i].classList.remove("pd-timeline__content--hidden");
					}
				}
			})(i);
		}
	};

	var verticalTimelines = document.getElementsByClassName("pd-timeline"),
		verticalTimelinesArray = [],
		scrolling = false;
	if( verticalTimelines.length > 0 ) {
		for( var i = 0; i < verticalTimelines.length; i++) {
			(function(i){
				verticalTimelinesArray.push(new VerticalTimeline(verticalTimelines[i]));
			})(i);
		}

		//show timeline blocks on scrolling
		window.addEventListener("scroll", function(event) {
			if( !scrolling ) {
				scrolling = true;
				(!window.requestAnimationFrame) ? setTimeout(checkTimelineScroll, 250) : window.requestAnimationFrame(checkTimelineScroll);
			}
		});

		// update line width when window resizes (horizontal timelines)
		window.addEventListener('resize', function() {
			verticalTimelinesArray.forEach(function(timeline){
				timeline.updateLineWidth();
			});
		});

		// also set line width once everything has loaded (images/font sizes)
		window.addEventListener('load', function() {
			verticalTimelinesArray.forEach(function(timeline){
				timeline.updateLineWidth();
			});
		});
	}

	function checkTimelineScroll() {
		verticalTimelinesArray.forEach(function(timeline){
			timeline.showBlocks();
			// update horizontal line width during scroll as layout may settle
			timeline.updateLineWidth();
		});
		scrolling = false;
	};
});