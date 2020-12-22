

function slug4(name)
{
    let l = []
    for( const c of name )
    {
        if( l.length == 4 )
            break;

        let t = c.charCodeAt(0);
        if( ( t >= 97 && t <= 122 ) || ( t >= 65 && t <= 90 ) )
        {
            l.push(c.toLowerCase())
        }
    }

    while( l.length < 4 )
    {
        l.push("a");
    }

    return l.join("");
}

function present_dialog(callbacks)
{
    let name = "";
    let address = "";
    let secret = "";

    if( localStorage.em_identity )
    {
        let identity = JSON.parse(localStorage.em_identity);
        name = identity.name;
        address = identity.keypair.address || "";
        secret = identity.keypair.secret || "";
    }

    $dialog = make_login_dialog(name, address, secret,
    {
        start : function(name, address, secret)
        {
            localStorage.em_identity = JSON.stringify(
                {
                    name: name,
                    keypair: {
                        address: address,
                        secret: secret,
                    }
                }
            );

            $("#screendoor-layer").empty();
            make_app(callbacks);
        },
        generate_keypair_and_start : function(name)
        {
            let keypair = earthstar.generateAuthorKeypair(slug4(name));
            localStorage.em_identity = JSON.stringify(
                {
                    name: name,
                    keypair: keypair
                }
            );

            $("#screendoor-layer").empty();
            make_app(callbacks);
        }
    });

    $("#screendoor-layer").append(
        $("<div>", {"class" : "screendoor"}),
        $dialog
    );

    return $dialog;
}

$(document).ready(
    function()
    {
        let callbacks = {
            close_app : function()
            {
                $("#main-menu-layer").empty();
                present_dialog(callbacks);
            }
        };

        if( localStorage.em_identity )
        {
            make_app(callbacks)
        }
        else
        {
            present_dialog(callbacks);
        }
    }
);
