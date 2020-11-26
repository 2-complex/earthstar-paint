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
        ctx.arc(
        x, y,
        radius / 2, 2 * Math.PI * (i-0.5) / n, 2 * Math.PI * (i+0.5) / n);
        ctx.stroke();
    }
}

/*
    Draws one mouse-move-event worth of paintbrush stroke.
*/
function draw_stroke_segment(ctx, x0, y0, x1, y1)
{
    let color = hsl_string(brush_settings.h, brush_settings.s, brush_settings.l);
    let radius = brush_settings.radius;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = radius;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
}


function init_paint_brush_events()
{
    let frame = $("#picture-frame-1");
    let dragging = false;
    let last_x = 0;
    let last_y = 0;

    function do_stroke_segment(evt)
    {
        let painting_canvas = $("#painting")[0];
        let painting_ctx = painting_canvas.getContext('2d');
        draw_stroke_segment(painting_ctx, last_x, last_y, evt.pageX, evt.pageY);
        last_x = evt.pageX;
        last_y = evt.pageY;
    }

    frame.mousedown(
        function(evt)
        {
            last_x = evt.pageX;
            last_y = evt.pageY;
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

            let overlay_canvas = $("#painting-overlay")[0];
            let overlay_ctx = overlay_canvas.getContext('2d');
            overlay_ctx.clearRect(0, 0, overlay_canvas.width, overlay_canvas.height);
            draw_brush(overlay_ctx, evt.pageX, evt.pageY, 20);
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
    let seq = [hsl_string(h, s, 0), hsl_string(h, s, 100)];
    return seq.join(", ")
}

function initPaintTools()
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

$(document).ready(
    function()
    {
        init_paint_brush_events();
        initPaintTools();
    }
);
