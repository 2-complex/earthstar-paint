
$(document).ready(
    function()
    {
        $("body").append(make_editor());
        init_paint_brush_events();
        init_paint_tools();
    }
);
