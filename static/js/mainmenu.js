
function repeat_text(text, n)
{
    let text_list = [];
    for( var i = 0; i < n; i++)
    {
        text_list.push(text)
    }
    return text_list.join(" ")
}

function present_editor(panel, $img)
{
    $("body").append(
        $("<div>", {"class" : "screendoor"}),
        make_editor(panel, $img)
    );
}

function make_comic(comic_info)
{
    let $comic = $("<div>", {"class" : "comic"});

    let $comic_container = $("<div>", {"class" : "comic-container"}).append(
        $("<div>", {"class" : "title"}).text(comic_info.title),
        $comic,
    ).css({width:comic_info.size[0], height:(30 + comic_info.size[1])});

    comic_info.panels.map(
        function(panel)
        {
            let $img = $("<img>", {"class" : "comic-panel"})
                .css({
                    left : panel.rect[0],
                    top : panel.rect[1],
                    width : panel.rect[2],
                    height : panel.rect[3],
                })

            if( panel.img_src )
            {
                $img.attr({src : panel.img_src})
            }

            if( panel.img_size )
            {
                $img.dblclick(function(evt)
                {
                    present_editor(panel, $img)
                })
            }

            $comic.append($img);
        }
    );

    return $comic_container;
}

function make_main_menu(comic_info_list)
{
    let $add_button = $("<button>", {"class":"add-button"}).text("+");
    let $list_items = $("<div>", {"class":"title-list-items"});
    let $view = $("<div>", {"class":"comic-view"});

    let $main_menu = $("<div>", {"class":"main-menu"}).append(
        $("<div>", {"class":"top-bar"}).append(
            $("<div>", {"class" : "title"}).text(repeat_text("JAM COMIC", 25))
        ),
        $("<div>", {"class":"content"}).append(
            $("<div>", {"class":"titles-list"}).append(
                $("<div>", {"class":"tool-bar"}).append($add_button),
                $list_items
            ),
            $view
        )
    );

    comic_info_list.map(
        function(info)
        {
            let $item = $("<div>", {"class" : "item"}).text(info.title);
            $list_items.append($item);
            $item.mouseup(
                function(evt)
                {
                    $view.empty();
                    $view.append(make_comic(info));
                }
            )
        }
    )

    return $main_menu;
}
