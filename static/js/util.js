
function stop_prop(evt)
{
    // This stops painting strokes from also
    // dragging the draggable parent:
    evt.preventDefault();
    evt.stopPropagation();
};

function absolute_draggable($item)
{
    let offset_x = 0;
    let offset_y = 0;

    $item.mousedown(
        function(evt)
        {
            offset_x = evt.pageX - parseInt($item.css("left"), 10);
            offset_y = evt.pageY - parseInt($item.css("top"), 10);
            x = evt.pageX;
            y = evt.pageY;

            $(document).on( "mousemove",
                function(evt)
                {
                    $item.css({
                        "left": evt.pageX - offset_x,
                        "top": evt.pageY - offset_y,
                    });
                }
            );

            $(document).on( "mouseup",
                function()
                {
                    $(document).off( "mousemove" );
                    $(document).off( "mouseup" );
                }
            );
        }
    )
}
