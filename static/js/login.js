
function make_login_dialog(default_name, default_address, default_secret, callbacks)
{
    let $intro_exp = $("<label>", {"class" : "explanation"}).text(
        "Welcome to Earthstar Media.  Please enter your name.  This will be your screenname as it displays to others.  Feel free to use a fun pseudonym!");
    $intro_exp.css({top : 20});

    let $name_input = $("<input>", {"class" : "name-input"}).attr({type:"text"});
    $name_input.val(default_name);

    let $name_input_container = $("<div>", {"class":"input-container"}).append(
        $("<label>", {"class" : "label"}).text("Name"),
        $name_input
    ).css({top : 80});

    let $keypair_exp = $("<label>", {"class" : "explanation"}).text(
        "If you have an Earthstar keypair, you can enter it here.  If not, leave these blank and don't worry about it ; )");
    $keypair_exp.css({top : 170});

    let $address_input = $("<input>", {"class" : "address-input"}).attr({type:"text"});
    $address_input.val(default_address);

    let $address_input_container = $("<div>", {"class":"input-container"}).append(
        $("<label>", {"class" : "label"}).text("Address"),
        $address_input
    ).css({top : 230});

    let $secret_input = $("<input>", {"class" : "secret-input"}).attr({type:"text"});
    $secret_input.val(default_secret);

    let $secret_input_container = $("<div>", {"class":"input-container"}).append(
        $("<label>", {"class" : "label"}).text("Secret"),
        $secret_input
    ).css({top : 270});


    let $confirm_button = $("<button>", {"class" : "confirm-button"}).text("Let's go!");

    $confirm_button.click(function(evt)
    {
        let name = $name_input.val();
        let address = $address_input.val();
        let secret = $secret_input.val();

        if( address == "" || secret == "" )
        {
            callbacks.generate_keypair_and_start(name);
        }
        else
        {
            callbacks.start(name, address, secret);
        }
    })

    let $login_dialog = $("<div>", {"class" : "dialog login-dialog"}).append(
        $intro_exp,
        $name_input_container,
        $keypair_exp,
        $address_input_container,
        $secret_input_container,
        $confirm_button,
    );

    $login_dialog.css({
        top: 100,
        left: 100
    });

    absolute_draggable($login_dialog);

    $name_input.mousedown(stop_prop);
    $address_input.mousedown(stop_prop);
    $secret_input.mousedown(stop_prop);
    $confirm_button.mousedown(stop_prop);

    return $login_dialog;
}
