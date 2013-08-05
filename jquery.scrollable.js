/*
 * jQuery Scrollable
 *
 * Copyright (c) 2012 Mike Cao <mike@mikecao.com>
 * License under the MIT license
 */
(function($, window, document, undefined){
    // Default configuration options
    var defaults = {
        width: 200,
        height: 200,
        showButtons: true,
        buttonSpeed: 20,
        minSliderSize: 10,
        animate: false,
        scrollSpeed: 300,
        mousewheel: true,
        mousewheelSpeed: 30,
        overlay: false,
        fadeSpeed: 300
    };

    /*** Helper functions ***/

    // Disables text selecton on an element
    function disable_select(el) {
        if ($.browser.mozilla) {
            el.css('MozUserSelect', 'none');
        }
        else if ($.browser.msie) {
            el.bind('selectstart', function(){ return false; });
        }
        else {
            el.mousedown(function(){ return false; });
        }
    }

    // Enables text selecton on an element
    function enable_select(el) {
        if ($.browser.mozilla) {
            el.css('MozUserSelect', 'text');
        }
        else if ($.browser.msie) {
            el.unbind('selectstart');
        }
        else {
            el.unbind("mousedown");
        }
    }

    /*** Scrollbar Elements ***/

    // Scrollbar slider
    function scrollslider(scrollbar) {
        this.base = scrollbar.base;
        this.scrollbar = scrollbar;

        this.init();
    }

    // Initialize the slider component
    scrollslider.prototype.init = function(){
        var _this = this;

        // Create element
        this.element = $('<div/>')
            .addClass('slider')
            .appendTo(this.scrollbar.track.element); 

        // Add event to slider
        this.element.bind('mousedown.scrollable', function(e){
            _this.enableMouse(e.clientX, e.clientY);
        });
    }

    // Enables mouse movement tracking
    scrollslider.prototype.enableMouse = function(startX, startY){
        var _this = this,
            pos = this.element.position();

        this.scrollbar.element.addClass('active');
        disable_select(this.base.view.content);

        // Disable mouse tracking
        $(document).bind('mouseup.scrollable', function(e){
            _this.disableMouse(e);
        });

        // Track mouse movement
        $(document).bind('mousemove.scrollable', function(e){
            _this.sliderMouseMove(
                (_this.scrollbar.type === 'horizontal') ?
                    e.clientX - startX + pos.left :
                    e.clientY - startY + pos.top
            );
        });
    }

    // Disables mouse movement tracking
    scrollslider.prototype.disableMouse = function(e){
        $(document).unbind('mousemove.scrollable').unbind(e);
        this.scrollbar.element.removeClass('active');
        enable_select(this.base.view.content);
    }

    // Handles mouse movements
    scrollslider.prototype.sliderMouseMove = function(pos){
        this.scrollbar.slider.moveTo(pos, false);
    }

    // Moves the slider to a target position
    scrollslider.prototype.moveTo = function(pos, animate){
        var viewsize = this.base.view.size()[this.scrollbar.unit],
            length = this.scrollbar.track.length(),
            origin = this.scrollbar.origin;

        // Keep within bounds
        if (pos < 0) pos = 0;
        else if (pos > length) pos = length;

        // Move the scrollbar slider
        this.element.css(origin, pos + 'px');

        // Move the view content
        this.base.view.moveTo(
            (origin === 'left') ? (-1 * viewsize * (pos / length)) : undefined,
            (origin === 'top') ? (-1 * viewsize * (pos / length)) : undefined,
            (animate !== undefined) ? animate :  this.base.options.animate
        );
    }

    // Scrollbar button
    function scrollbutton(scrollbar, type) {
        this.base = scrollbar.base;
        this.scrollbar = scrollbar;
        this.type = type;

        this.init();
    }

    // Initializes scrollbar buttons
    scrollbutton.prototype.init = function(){
        var _this = this;

        // Create button element
        this.element = $('<div/>')
           .addClass('button')
           .addClass(this.type)
           .appendTo(this.scrollbar.element);

        // Add click handler to button
        this.element.click(function(e){
            _this.buttonClick(e);
        });
    };

    // Handles clicks on scrollbar buttons
    scrollbutton.prototype.buttonClick = function(e) {
        var slider = this.scrollbar.slider,
            distance = this.base.options.buttonSpeed,
            pos = slider.element.position()[this.scrollbar.origin];

        switch (this.type) {
            case 'top':
                slider.moveTo(pos - distance);
                break;
            case 'bottom':
                slider.moveTo(pos + distance);
                break;
            case 'left':
                slider.moveTo(pos - distance);
                break;
            case 'right':
                slider.moveTo(pos + distance);
                break;
        }
    }

    // Scrollbar track
    function scrolltrack(scrollbar) {
        this.base = scrollbar.base;
        this.scrollbar = scrollbar;

        this.init();
    }

    // Initialize track component
    scrolltrack.prototype.init = function() {
        var _this = this;

        // Create track element
        this.element = $('<div/>')
            .addClass('track')
            .width(this.scrollbar.element.width())
            .height(this.scrollbar.element.height())
            .appendTo(this.scrollbar.element);

        // Add click handler to track
        this.element.click(function(e){
            _this.trackClick((_this.scrollbar.type === 'vertical') ? e.pageY : e.pageX);
        });
    }

    // Handles clicks on the scollbar track
    scrolltrack.prototype.trackClick = function(pos) {
        var slider = this.scrollbar.slider.element,
            origin = this.scrollbar.origin,
            unit = this.scrollbar.unit;

        if (pos < slider.offset()[origin]) {
            this.scrollbar.slider.moveTo(slider.position()[origin] - slider[unit]());
        }
        else if (pos > slider.offset()[origin] + slider[unit]()) {
            this.scrollbar.slider.moveTo(slider.position()[origin] + slider[unit]());
        }
    }

    // Gets the length of the track
    scrolltrack.prototype.length = function(){
        return (this.scrollbar.type === 'vertical') ?
            this.element.height() - this.scrollbar.slider.element.height() :
            this.element.width() - this.scrollbar.slider.element.width();
    }

    // Scrollbar
    function scrollbar(scrollable, type) {
        this.base = scrollable;
        this.type = type;
        this.enabled = true;

        this.init();
    }

    // Initialize scroll bar
    scrollbar.prototype.init = function(){
        var _this = this;

        // Create element
        this.element = $('<div/>')
            .addClass('bar')
            .addClass(this.type)
            .appendTo(this.base.element);

        disable_select(this.element);

        // Create the scrollbar track
        this.track = new scrolltrack(this);

        // Create buttons
        if (this.type == 'vertical') {
            this.button1 = new scrollbutton(this, 'top');
            this.button2 = new scrollbutton(this, 'bottom');
        }
        else if (this.type == 'horizontal') {
            this.button1 = new scrollbutton(this, 'left');
            this.button2 = new scrollbutton(this, 'right');
        }

        // Create slider
        this.slider = new scrollslider(this);

        // Set properties
        switch (this.type) {
            case 'horizontal':
                this.origin = 'left';
                this.unit = 'width';
                break;

            case 'vertical':
                this.origin = 'top';
                this.unit = 'height';
                break;
        }
    }

    // Updates scrollbar components
    scrollbar.prototype.update = function() {
        // Hide or show scrollbar
        this.element[(this.enabled) ? 'show' : 'hide']();

        if (!this.enabled) return;

        var view = this.base.view,
            unit = this.unit,
            options = this.base.options,
            show = (options.showButtons) ? 'show' : 'hide',
            bar = (this.type === 'vertical') ? this.base.hbar : this.base.vbar;

        // Overlay setup
        if (this.base.options.overlay) {
            this.element.addClass('overlay');

            if (bar.enabled) { 
                this.element[unit](view.element[unit]() - bar.element[this.unit]());
            }
        }
        else {
            // Set length to match view
            this.element[unit](view.element[unit]());
        }

        // Show or hide buttons
        this.button1.element[show]();
        this.button2.element[show]();

        // Adjust track size for buttons
        if (options.showButtons) {
            this.track.element.css(this.origin, this.button1.element[unit]() + 'px');
            this.track.element[unit](view.element[unit]() - (this.button1.element[unit]() * 2));
        }
        else {
            this.track.element[unit](view.element[unit]());
        }

        // Adjust slider size
        var size = (this.element[unit]() / view.content[unit]()) * this.track.element[unit]();
        this.slider.element[unit]((size > options.minSliderSize) ? size : options.minSliderSize);
    }

    // Scroll view
    function scrollview(scrollable) {
        this.base = scrollable;
        this.content = $(scrollable.target);

        this.init();
    }

    // Initializes the scroll view
    scrollview.prototype.init = function() {
        // Create element
        this.element = this.content.wrap('<div class="view"></div>')
            .parent()
            .width(this.base.options.width)
            .height(this.base.options.height);

        // Reset content
        this.content.css({ position: 'absolute', top: 0, left: 0 });
    }

    // Updates the view components
    scrollview.prototype.update = function() {
        var vbar = this.base.vbar.element,
            hbar = this.base.hbar.element;

        // Make room for scrollbars
        if (!this.base.options.overlay) {
            if (this.base.vbar.enabled) {
                this.element.width(this.base.element.width() - vbar.outerWidth());
            }
            if (this.base.hbar.enabled) {
                this.element.height(this.base.element.height() - hbar.outerHeight());
            }
        }

        // Reset the view if scrollbars are not needed
        if (!this.base.vbar.enabled && !this.base.hbar.enabled) {
            this.moveTo(0, 0, false);
        }
    }

    // Moves a view to specified coordinates
    scrollview.prototype.moveTo = function(left, top, animate){
        var props = {};

        if (left !== undefined) props.left = left + 'px';
        if (top !== undefined) props.top = top + 'px';

        if (animate) {
            this.content.stop(true,false).animate(props, this.base.options.scrollSpeed);
        }
        else {
            this.content.css(props);
        }
    }

    // Gets the scrollable size of the view
    scrollview.prototype.size = function(){
        return {
            width: this.content.outerWidth() - this.element.width(),
            height: this.content.outerHeight() - this.element.height()
        };
    }

    // Scrollable area
    function scrollable(target, options){
        this.target = target;
        this.options = $.extend({}, defaults, options);

        this.init();
    }

    // Initializes scrollable area
    scrollable.prototype.init = function(){
        // Create element
        this.element = $(this.target)
            .wrap('<div class="scrollable"></div>')
            .parent()
            .width(this.options.width)
            .height(this.options.height);

        this.view = new scrollview(this);
        this.vbar = new scrollbar(this, 'vertical');
        this.hbar = new scrollbar(this, 'horizontal');

        this.update();
    }

    // Updates components of the scrollable area
    scrollable.prototype.update = function(options){
        var _this = this;

        // Update existing options
        this.options = $.extend({}, this.options, options);

        // Set the size of scrollable area
        this.element.width(this.options.width)
            .height(this.options.height);

        // Set view size to match container
        this.view.element.width(this.options.width)
            .height(this.options.height);

        // Check is scrollbars are needed
        this.vbar.enabled = (this.view.content.height() > this.element.height());
        this.hbar.enabled = (this.view.content.width() > this.element.width());

        // Adjust components
        this.view.update();
        this.vbar.update();
        this.hbar.update();

        // Enable mousewheel
        if (this.options.mousewheel) {
            this.element.unbind('mousewheel').bind('mousewheel', function(event, delta, deltaX, deltaY) {
                _this.mouseScroll(event, delta, deltaX, deltaY);
            });
        }
        else {
            this.element.unbind('mousewheel');
        }

        // Overlay setup
        if (this.options.overlay) {
            this.element.hover(
                function(){
                    if (_this.vbar.enabled) _this.vbar.element.fadeIn(_this.options.fadeSpeed);
                    if (_this.hbar.enabled) _this.hbar.element.fadeIn(_this.options.fadeSpeed);
                },
                function(){
                    if (_this.vbar.enabled) _this.vbar.element.fadeOut(_this.options.fadeSpeed);
                    if (_this.hbar.enabled) _this.hbar.element.fadeOut(_this.options.fadeSpeed);
                }
            );
        }
        else {
            this.element.unbind('mouseenter mouseleave');
        }
    }

    // Handle mousewheel movement
    scrollable.prototype.mouseScroll = function(event, delta, deltaX, deltaY) {
        var vpos = this.vbar.slider.element.position(),
            hpos = this.hbar.slider.element.position();

        if (deltaY !== 0 && this.vbar.enabled) {
            this.vbar.slider.moveTo(vpos.top - (this.options.mousewheelSpeed * deltaY), false);
        }
        if (deltaX !== 0 && this.hbar.enabled) {
            this.hbar.slider.moveTo(hpos.left + (this.options.mousewheelSpeed * deltaX), false);
        }
        event.preventDefault();
    }

    /*** jQuery functions ***/

    $.fn.scrollable = function(options){
        return this.each(function(){
            var el = $(this),
                obj = el.data('scrollable');

            if (obj === undefined) {
                el.data('scrollable', new scrollable(this, options)); 
            }
            else {
                obj.update(options);
            }
        });
    }
})(jQuery, window, document);
