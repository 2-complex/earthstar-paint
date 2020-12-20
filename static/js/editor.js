
function make_menu_bar(callbacks, $img, painting_canvas, panel)
{
    let $menu_bar = $("<div>", {"class" : "menu-bar"});

    let $save_button = $("<button>").append(
        get_icon_svg("save", "button-icon", {})
    ).css({left: 355});

    let $close_button = $("<button>").append(
        get_icon_svg("close", "button-icon", {})
    ).css({left: 410});

    $close_button.click(
        function(evt)
        {
            callbacks.close_editor();
        }
    )

    $save_button.click(
        function(evt)
        {
            callbacks.save_image($img, painting_canvas, panel);
        }
    )

    return $menu_bar.append(
        $save_button,
        $close_button);
}

function make_picture_frame(panel, $img)
{
    let width = panel.img_size[0];
    let height = panel.img_size[1];

    let $picture_frame = $("<div>", {"class":"picture-frame"});
    $picture_frame.css({"width":width+250, "height":height+250});

    let $picture_background = $("<div>", {"class":"picture-background"});
    $picture_background.css({top:25, left:25, "width":width+200, "height":height+200});

    let painting = $("<canvas>", {"class":"painting"})
        .css({top:100, left:100})
        .attr({width:width, height:height});

    let overlay = $("<canvas>", {"class":"painting overlay"})
        .attr({"width":width+200,"height":height+200});

    $picture_background.append(painting, overlay);
    $picture_frame.append($picture_background)

    let painting_canvas = init_paint_brush_events($picture_background, painting, overlay, panel, $img);

    $picture_frame.draggable();

    return {
        $picture_frame : $picture_frame,
        $picture_background : $picture_background,
        painting_canvas : painting_canvas,
    }
}

function make_tools_frame(picture_height)
{
    let $hue = $("<div>", {"class": "slider-container"});
    let $saturation = $("<div>", {"class": "slider-container"});
    let $lightness = $("<div>", {"class": "slider-container"});
    let $radius = $("<div>", {"class": "slider-container"});
    let $info_display_hsv = $("<div>", {"class":"info-display"});
    let $info_display_radius = $("<div>", {"class":"info-display"});
    let $swatch = $("<canvas>", {"class":"swatch"}).attr({'width':100,'height':100});

    let $tools_frame = $("<div>", {"class":"tools-frame noselect"}).append(
        $("<div>", {"class":"labeled-slider"}).css({top : 10})
        .append(
            $("<div>", {"class": "prop-label"}).text("H"),
            $hue
        ),
        $("<div>", {"class":"labeled-slider"}).css({top : 40})
        .append(
            $("<div>", {"class": "prop-label"}).text("S"),
            $saturation
        ),
        $("<div>", {"class":"labeled-slider"}).css({top : 70})
        .append(
            $("<div>", {"class": "prop-label"}).text("L"),
            $lightness
        ),
        $("<div>", {"class":"labeled-slider"}).css({top : 120})
        .append(
            $("<div>", {"class": "prop-label"}).text("R"),
            $radius
        ),
        $swatch,
        $info_display_hsv.css({top : 115}),
        $info_display_radius.css({top : 135})
    ).css({top: picture_height + 210});

    init_paint_tools({
         $hue : $hue,
         $saturation : $saturation,
         $lightness : $lightness,
         $radius : $radius,
         $info_display_hsv : $info_display_hsv,
         $info_display_radius : $info_display_radius,
         $swatch : $swatch,
    });

    $tools_frame.draggable();

    return $tools_frame;
}

function make_editor(panel, $img, callbacks)
{
    let picture_frame_info = make_picture_frame(panel, $img)

    let editor = $("<div>", {"class":"editor"}).append(
        make_menu_bar(callbacks, $img, picture_frame_info.painting_canvas, panel),
        picture_frame_info.$picture_frame.css({top:50}),
        make_tools_frame(panel.img_size[1])
    );

    return editor;
}

var brush_settings = {
    h: 90,
    s: 100,
    l: 50,
    radius: 5
}

function hsl_string(h, s, l)
{
    return "hsl(" +
        h.toString(10) + ", " +
        s.toString(10) + "%, " +
        l.toString(10) + "%)";
}

/*
    Draws a dashed circle to make a circular cursor-like thing in to whatever
    context it's given, but the intent is it's the overlay canvas.
*/
function draw_brush(ctx, x, y)
{
    let radius = brush_settings.radius;
    var n = 16;
    for( var i = 0; i < n; i++ )
    {
        ctx.strokeStyle = ["#000", "#fff"][i % 2];
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius / 2, 2 * Math.PI * (i-0.5) / n, 2 * Math.PI * (i+0.5) / n);
        ctx.stroke();

        ctx.strokeStyle = "#888";
        ctx.globalAlpha = 0.03;
        ctx.beginPath();
        ctx.moveTo(-10000, y);
        ctx.lineTo(10000, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, -10000);
        ctx.lineTo(x, 10000);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
}

/*
    Draws one mouse-move-event worth of paintbrush stroke.
*/
function draw_stroke_segment(ctx, x0, y0, x1, y1)
{
    let color = hsl_string(
        brush_settings.h,
        brush_settings.s,
        brush_settings.l);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = brush_settings.radius;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
}

function get_point_in_element(evt, elem)
{
    var x = evt.pageX - elem.offset().left;
    var y = evt.pageY - elem.offset().top;

    return {x: x, y: y};
}

function init_paint_brush_events(frame, painting, overlay, panel, $img)
{
    let dragging = false;
    let last_x = 0;
    let last_y = 0;

    let painting_canvas = painting[0];
    let painting_ctx = painting_canvas.getContext('2d');

    let overlay_canvas = overlay[0];
    let overlay_ctx = overlay_canvas.getContext('2d');

    if( panel.img_src )
    {
        painting_ctx.drawImage($img[0], 0, 0);
    }
    else
    {
        painting_ctx.fillStyle = "#fff";
        painting_ctx.fillRect(0, 0, panel.img_size[0], panel.img_size[1]);
    }

    function do_stroke_segment(evt)
    {
        let point = get_point_in_element(evt, painting);

        draw_stroke_segment(painting_ctx, last_x, last_y, point.x, point.y);
        last_x = point.x;
        last_y = point.y;
    }

    frame.mousedown(
        function(evt)
        {
            let point = get_point_in_element(evt, painting);

            last_x = point.x;
            last_y = point.y;
            dragging = true;
            do_stroke_segment(evt);

            // This stops painting strokes from also
            // dragging the draggable parent:
            evt.preventDefault();
            evt.stopPropagation();
        }
    )

    $(document).mouseup(
        function()
        {
            dragging = false;
        }
    )

    frame.mouseup(
        function()
        {
            dragging = false;
        }
    )

    frame.mousemove(
        function(evt)
        {
            if( dragging )
            {
                do_stroke_segment(evt);
            }

            overlay_ctx.clearRect(0, 0, overlay_canvas.width, overlay_canvas.height);
            let point = get_point_in_element(evt, overlay);
            draw_brush(overlay_ctx, point.x, point.y, 20);
        }
    );

    return painting_canvas;
}

function hue_background_color_sequence(s, l)
{
    let seq = [];
    let n = 8;
    for( let i = 0; i <= n; i++ )
    {
        seq.push(hsl_string(i * 360/n, s, l));
    }

    return seq.join(", ")
}

function saturation_background_color_sequence(h, l)
{
    let seq = [hsl_string(h, 0, l), hsl_string(h, 100, l)];
    return seq.join(", ")
}

function lightness_background_color_sequence(h, s)
{
    let seq = [];
    let n = 8;
    for( let i = 0; i <= n; i++ )
    {
        seq.push(hsl_string(h, s, i * 100/n));
    }

    return seq.join(", ")
}

function init_paint_tools(tool_info)
{
    function refresh_swatch()
    {
        var h = tool_info.$hue.slider( "value" );
        var s = tool_info.$saturation.slider( "value" );
        var l = tool_info.$lightness.slider( "value" );
        var radius = tool_info.$radius.slider( "value" );

        brush_settings.h = h;
        brush_settings.s = s;
        brush_settings.l = l;
        brush_settings.radius = radius;

        tool_info.$hue.css({"background-image": "linear-gradient(to right, " + hue_background_color_sequence(s, l) + ")"});
        tool_info.$saturation.css({"background-image": "linear-gradient(to right, " + saturation_background_color_sequence(h, l) + ")"});
        tool_info.$lightness.css({"background-image": "linear-gradient(to right, " + lightness_background_color_sequence(h, s) + ")"});

        tool_info.$info_display_hsv.text(h + " " + s + "% " + l + "%");
        tool_info.$info_display_radius.text(radius);

        let swatch_canvas = tool_info.$swatch[0];
        let swatch_ctx = swatch_canvas.getContext('2d');
        swatch_ctx.clearRect(0, 0, swatch_canvas.width, swatch_canvas.height);
            draw_stroke_segment(swatch_ctx, 0, 100, 50, 50, radius, hsl_string(h, s, l));
        draw_brush(swatch_ctx, 50, 50, radius);
    }

    function slider_config(max)
    {
        return {
            orientation: "horizontal",
            range: "min",
            max: max,
            value: 0,
            slide: refresh_swatch,
            change: refresh_swatch
        };
    }

    tool_info.$hue.slider(slider_config(360));
    tool_info.$saturation.slider(slider_config(100));
    tool_info.$lightness.slider(slider_config(100));
    tool_info.$radius.slider(slider_config(200));

    let h = brush_settings.h;
    let s = brush_settings.s;
    let l = brush_settings.l;
    let radius = brush_settings.radius;

    tool_info.$hue.slider( "value", h );
    tool_info.$saturation.slider( "value", s );
    tool_info.$lightness.slider( "value", l );
    tool_info.$radius.slider( "value", radius );
}
