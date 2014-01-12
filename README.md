# jQuery Scrollable Plugin

This plugin adds customizable scrollbars to any element. You can style the scrollbars using CSS.

[View Examples](http://mikecao.github.io/jquery-scrollable/)

# Usage

1) Include the CSS file.

    <link rel="stylesheet" type="text/css" href="jquery.scrollable.css" />

2) Include the JS file.

    <script type="text/javascript" src="jquery.scrollable.js"></script>

3) Add scrollbars to an element.

    $("#content").scrollable();

For scrollbars to appear, the content must be larger than the scrollable area. By default the plugin will set a height and width of 200px by 200px for the scrollable area. You can set the dimensions of the area by passing in optional height and width parameters.

    $("#content").scrollable({ width: 640, height: 480 });

If the content changes, simply call the plugin again and the scrollbars will adjust to the new content size. 

    $("#content").append('Adding more text.').scrollable();

# Options

You can modify the behavior of the scrollbars by passing in optional parameters to the plugin.

    width - Width of the scrollable area. (default: 200)
    height - Height of the scrollable area. (default: 200)
    showButtons - Show buttons on the scrollbar. (default: true)
    buttonSpeed - Distance to scroll in pixels when clicking on buttons. (default: 20)
    minSliderSize - Minimum size for the scrollbar slider in pixels. (default: 10)
    animate - Animate the scrolling when clicking on the scrollbar. (default: false)
    scrollSpeed - Scrolling animation speed in milliseconds. (default: 300)
    mousewheel - Enable mousewheel support. (default: true)
    mousewheelSpeed - Distance to scroll in pixels when using the mousewheel. (default: 30)
    overlay - Scrollbars only appear when hovering over the content. (default: false)
    fadeSpeed - Fading animation speed in milliseconds for overlay scrollbars. (default: 300)
    className - CSS classname to add to the scrollable element. (default: '')

Mousewheel support requires the [jquery.mousewheel](https://github.com/brandonaaron/jquery-mousewheel) plugin.

# License

This plugin is released under the [MIT](https://github.com/mikecao/jquery-scrollable/blob/master/LICENSE) license.
