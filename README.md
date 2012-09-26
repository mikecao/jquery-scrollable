# jQuery Scrollable Plugin

This plugin adds customizable scrollbars to any element. You can style the scrollbars using CSS.

# Usage

1) Include the CSS file.

    <link rel="stylesheet" type="text/css" href="jquery.scrollable.css" />

2) Include the JS file.

    <script type="text/javascript" src="jquery.scrollable.js"></script>

3) Add scrollbars to an element.

    $("#content").scrollable();

By default the plugin with bound the content in a 200px x 200px box and add scrollbars if the content exceeds the bounding box. You can set the dimensions of the bounding box by passing in optional height and width parameters.

    $("#content").scrollable({width: 640, height: 480 });

# Options

You can modify the behavior of the scrollbars by passing in optional parameters to the plugin.

    width - Width of the scrollable area. (default: 200)
    height - Height of the scrollable area. (default: 200)
    showButtons - Show buttons on the scrollbar. (default: true)
    buttonSpeed - Distance to scroll in pixels when clicking on buttons. (default: 20)
    minSliderSize - Minimum size in pixels for the scrollbar slider. (default: 20)
    animate - Animate the scrolling when clicking on the scrollbar. (default: true)
    scrollSpeed - Scrolling animation speed in milliseconds. (default: 300)
    mousewheel - Enable mousewheel support. Requires the (jquery.mousewheel plugin)[https://github.com/brandonaaron/jquery-mousewheel]. (default: false)
    mousewheelSpeed - Distance to scroll in pixels when using the mousewheel. (default: 30)

# License

This plugin is released under the [MIT](http://www.opensource.org/licenses/mit-license.php) license.
