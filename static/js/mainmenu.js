function make_thumbnail_layout(template)
{
    let k = 4;

    let $parent = $("<div>", {"class": "layout-thumbnail-box"}).css({
        top : 0,
        left: 0,
        width: template.size[0] / k,
        height: template.size[1] / k
    });

    for( let i = 0; i < template.panels.length; i++ )
    {
        let panel = template.panels[i];
        $parent.append($("<div>", {"class" : "layout-thumbnail-box"}).css({
            left: panel.rect[0] / k,
            top: panel.rect[1] / k,
            width : panel.rect[2] / k,
            height : panel.rect[3] / k,
        }))
    }

    return $parent;
}

function make_new_comic_dialog(templates, callbacks)
{
    let $title_input = $("<input>", {"class" : "title-input"}).attr({type:"text"});

    let $title_input_container = $("<div>", {"class":"input-container"}).append(
        $("<label>", {"class" : "label"}).text("Title"),
        $title_input
    ).css({top : 20});


    let $right_button = $("<button>").append(
        get_icon_svg("left", "layout-left-svg", {})
    );

    let $left_button = $("<button>").append(
        get_icon_svg("right", "layout-right-svg", {})
    ).css({left:45});

    let $layout_button_container = $("<div>", {"class":"layout-button-container"}).append(
        $right_button,
        $left_button
    )

    let $layout_name = $("<div>", {"class" : "layout-name"}).text("layoutname");

    let $layout_input_container = $("<div>", {"class":"input-container"}).append(
        $("<label>", {"class" : "label"}).text("Layout"),
        $layout_button_container,
        $layout_name,
    ).css({top : 80});

    let $layout_preview = $("<div>", {"class" : "layout-preview"});

    let $close_box = $("<button>", {"class" : "close-box"}).append(
        get_icon_svg("close", "close-box-svg", {})
    );

    let $confirm_button = $("<button>", {"class" : "confirm-button"}).text("Make");

    let index = 0
    function set_index(i)
    {
        let num_templates = templates.length;
        i = (i%num_templates+num_templates)%num_templates;
        index = i;

        $layout_name.text(templates[i].title)

        $layout_preview.empty();
        $layout_preview.append(
            make_thumbnail_layout(templates[i]).css({top: 10, left:10})
        );
    }

    set_index(0);

    $right_button.click(function(evt)
    {
        set_index(index+1);
    });

    $left_button.click(function(evt)
    {
        set_index(index-1);
    });

    $confirm_button.click(function(evt)
    {
        callbacks.new_comic(index, $title_input.val());
    })

    $close_box.click(function(evt)
    {
        callbacks.close_dialog(index);
    })

    let $new_comic_dialog = $("<div>", {"class" : "new-comic-dialog noselect"}).append(
        $title_input_container,
        $layout_input_container,
        $layout_preview,
        $confirm_button,
        $close_box,
    );

    $new_comic_dialog.css({
        top: 100,
        left: 100
    });

    absolute_draggable($new_comic_dialog);

    return $new_comic_dialog;
}

function repeat_text(text, n)
{
    let text_list = [];
    for( var i = 0; i < n; i++)
    {
        text_list.push(text)
    }
    return text_list.join(" ")
}

function present_editor(panel, $img, callbacks)
{
    $("#screendoor-layer").append(
        $("<div>", {"class" : "screendoor"}),
        make_editor(panel, $img, callbacks)
    );
}

function present_new_comic_dialog(templates, callbacks)
{
    $("#screendoor-layer").append(
        $("<div>", {"class" : "screendoor"}),
        make_new_comic_dialog(templates, callbacks)
    );
}

function make_comic(comic_info, callbacks)
{
    let $comic = $("<div>", {"class" : "comic"});

    let $comic_container = $("<div>", {"class" : "comic-container noselect"}).append(
        $("<div>", {"class" : "title"}).text(comic_info.title),
        $comic,
    ).css({width:comic_info.size[0], height:(35 + comic_info.size[1])});

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
                    present_editor(panel, $img, callbacks)
                })
            }

            $comic.append($img);
        }
    );

    return $comic_container;
}


var $list_items;
var $view;
var g_callbacks = null;

function update_comic_list(comic_info_list)
{
    $list_items.empty();

    comic_info_list.map(
        function(info)
        {
            let $item = $("<div>", {"class" : "item"}).text(info.title);
            $list_items.append($item);
            $item.mouseup(
                function(evt)
                {
                    $view.empty();
                    $view.append(make_comic(info, g_callbacks));
                }
            )
        }
    );
}

function make_main_menu(comic_templates, callbacks)
{
    g_callbacks = callbacks;

    let $add_button = $("<button>", {"class":"add-button"}).text("+");
    $list_items = $("<div>", {"class":"title-list-items"});
    $view = $("<div>", {"class":"comic-view"});

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

    $add_button.mouseup(function(evt)
    {
        present_new_comic_dialog(comic_templates, callbacks);
    });

    return $main_menu;
}

function make_app()
{
    $("#main-menu-layer").append(make_main_menu(
        get_template_list(),
        {
            close_editor : function() {
                $("#screendoor-layer").empty();
            },
            save_image : function($img, canvas, panel) {
                let data_url = canvas.toDataURL();
                $img[0].src = data_url;

                $.when($.ajax({
                    type: "POST",
                    url: "/upload-base64",
                    data: {filename: "panel.png", content: data_url},
                }) ).then(
                    function(result)
                    {
                        let img_src = "/files/" + result.hashcode;
                        $img[0].src = img_src;
                        panel.img_src = img_src;
                    }
                ).fail(
                    function()
                    {
                        console.log("Saving to server error")
                    }
                );
            },
            close_dialog : function() {
                $("#screendoor-layer").empty();
            },
            new_comic : function(template_index, title)
            {
                $("#screendoor-layer").empty();
                let template = copy_template_with_index(template_index)

                if( title != "" )
                {
                    template.title = title
                    model_add_comic(template)
                }
            }
        }
    ));
}

