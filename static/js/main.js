
$(document).ready(
    function()
    {
        $("body").append(make_editor(
            {
                rect: [10, 10, 400, 400],
                img_size: [600, 600],
                img_src: "https://i2.wp.com/ceklog.kindel.com/wp-content/uploads/2013/02/firefox_2018-07-10_07-50-11.png"
            }
        ));

/*

        $("body").append(make_main_menu([
            {
                title: "My Fancy Comic",
                size: [1230, 830],
                panels: [
                    {
                        rect: [10, 10, 400, 400],
                        img_size: [600, 600],
                        img_src: "https://i2.wp.com/ceklog.kindel.com/wp-content/uploads/2013/02/firefox_2018-07-10_07-50-11.png"
                    },
                    {
                        rect: [420, 10, 800, 400],
                        img_size: [1200, 600],
                        img_src: "http://www.clker.com/cliparts/5/e/f/d/12641151641212030083billiard_table-md.png"
                    },
                    {
                        rect: [10, 420, 800, 400],
                        img_size: [1200, 600],
                    },
                    {
                        rect: [820, 420, 400, 400],
                        img_size: [600, 600],
                    },
                ]
            },
            {
                size: [600, 500],
                title: "My Other Fancy Comic",
                panels: [],
            },

            {
                size: [70, 12],
                title: "A very very very very very very very very very very very very long title",
                panels: [],
            },
        ]));
*/
    }
);
