
var templates_funcs = [
    function()
    {
        return {
            title: "4 panels: two wide staggard",
            size: [1230, 830],
            panels: [
                {
                    rect: [10, 10, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [420, 10, 800, 400],
                    img_size: [1200, 600],
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
        };
    },

    function()
    {
        return {
            title: "6 panels: 3x2",
            size: [1240, 830],
            panels: [
                {
                    rect: [10, 10, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [420, 10, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [830, 10, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [10, 420, 800, 400],
                    img_size: [1200, 600],
                },
                {
                    rect: [420, 420, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [830, 420, 400, 400],
                    img_size: [600, 600],
                },
            ]
        };
    },

    function()
    {
        return {
            title: "6 panels: 2x3",
            size: [830, 1240],
            panels: [
                {
                    rect: [10, 10, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [10, 420, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [10, 830, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [420, 10, 400, 800],
                    img_size: [1200, 600],
                },
                {
                    rect: [420, 420, 400, 400],
                    img_size: [600, 600],
                },
                {
                    rect: [420, 830, 400, 400],
                    img_size: [600, 600],
                },
            ]
        };
    },

    function()
    {
        return {
            title: "3 panels: 2 small 1 big",
            size: [830, 1230],
            panels: [
                {
                    rect: [10, 10, 400, 400],
                    img_size: [400, 400],
                },
                {
                    rect: [420, 10, 400, 400],
                    img_size: [400, 400],
                },
                {
                    rect: [10, 420, 810, 810],
                    img_size: [800, 800],
                },
            ]
        }
    },
]

function get_template_list()
{
    return templates_funcs.map(function(f) { return f() });
}

function copy_template_with_index(i)
{
    return templates_funcs[i]();
}
