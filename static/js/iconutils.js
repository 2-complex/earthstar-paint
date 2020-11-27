
function get_icon_svg(name, class_name, options)
{
    options = options || {};
    options.viewBox = options.viewBox || "0 0 25 25";
    options.transform = options.transform || "translate(3,20) scale(0.012,-0.012)";

    return $([
        '<svg class="' + (class_name || "icon") + '" viewbox="' + options.viewBox + '">',
        '<path transform="' + options.transform + '" d="',
        get_icon_info(name).d,
        '"/></svg>'].join(' ') );
};

