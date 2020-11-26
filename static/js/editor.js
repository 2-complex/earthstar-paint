
function make_picture_frame(width, height)
{
    return $("<div>", {id:"picture-frame-1", "class":"picture-frame"}).append(
        $("<canvas>", {id:"painting", "class":"painting"})
            .attr({"width":width,"height":height}),
        $("<canvas>", {id:"painting-overlay", "class":"painting overlay"})
            .attr({"width":width,"height":height})
    ).css({"width":width, "height":height});
}

function make_tools_frame()
{
    return $("<div>", {id:"tools-frame-1", "class":"tools-frame"}).append(
        $("<div>", {id:"hue-labeled-slider", "class":"labeled-slider"}).append(
            $("<div>", {"class": "prop-label"}).text("L"),
            $("<div>", {id:"hue", "class": "slider-container"})
        ),
        $("<div>", {id:"saturation-labeled-slider", "class":"labeled-slider"}).append(
            $("<div>", {"class": "prop-label"}).text("L"),
            $("<div>", {id:"saturation", "class": "slider-container"})
        ),
        $("<div>", {id:"lightness-labeled-slider", "class":"labeled-slider"}).append(
            $("<div>", {"class": "prop-label"}).text("L"),
            $("<div>", {id:"lightness", "class": "slider-container"})
        ),
        $("<div>", {id:"radius-labeled-slider", "class":"labeled-slider"}).append(
            $("<div>", {"class": "prop-label"}).text("R"),
            $("<div>", {id:"radius", "class": "slider-container"})
        ),
        $("<canvas>", {"class":"swatch", id:"swatch"}).attr({'width':100,'height':100}),
        $("<div>", {id:"info-display-hsv", "class":"info-display"}),
        $("<div>", {id:"info-display-radius", "class":"info-display"})
    )
}

function make_editor()
{
    return $("<div>", {id:"editor"}).append(
        make_picture_frame(800, 540),
        make_tools_frame()
    );
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

function init_paint_brush_events()
{
    let frame = $("#picture-frame-1");
    let dragging = false;
    let last_x = 0;
    let last_y = 0;

    let painting = $("#painting");
    let painting_canvas = painting[0];
    let painting_ctx = painting_canvas.getContext('2d');

    let overlay = $("#painting-overlay");
    let overlay_canvas = overlay[0];
    let overlay_ctx = overlay_canvas.getContext('2d');

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

function init_paint_tools()
{
    function refresh_swatch()
    {
        var h = $( "#hue" ).slider( "value" );
        var s = $( "#saturation" ).slider( "value" );
        var l = $( "#lightness" ).slider( "value" );
        var radius = $( "#radius" ).slider( "value" );

        brush_settings.h = h;
        brush_settings.s = s;
        brush_settings.l = l;
        brush_settings.radius = radius;

        $("#hue").css({"background-image": "linear-gradient(to right, " + hue_background_color_sequence(s, l) + ")"});
        $("#saturation").css({"background-image": "linear-gradient(to right, " + saturation_background_color_sequence(h, l) + ")"});
        $("#lightness").css({"background-image": "linear-gradient(to right, " + lightness_background_color_sequence(h, s) + ")"});

        $('#info-display-hsv').text(h + " " + s + "% " + l + "%");
        $('#info-display-radius').text(radius);

        let swatch_canvas = $("#swatch")[0];
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

    $( "#saturation, #lightness" ).slider(slider_config(100));
    $( "#hue" ).slider(slider_config(360));
    $( "#radius" ).slider(slider_config(200));

    let h = brush_settings.h;
    let s = brush_settings.s;
    let l = brush_settings.l;
    let radius = brush_settings.radius;

    $( "#hue" ).slider( "value", h );
    $( "#saturation" ).slider( "value", s );
    $( "#lightness" ).slider( "value", l );
    $( "#radius" ).slider( "value", radius );
}