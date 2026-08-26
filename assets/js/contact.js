$(document).ready(function () {
    var nameErr = true;
    var c_nameErr = true;
    var urlErr = true;
    var reasonErr = true;
    var whatsappErr = true;
    var emailErr = true;
    var desErr = true;
    var name, c_name, reason, url, whatsapp, email, des;

    //FORM VALIDATION
    $("#name").on("keyup", function () {
        name = $(this).val();

        if (name.length > 35 || name.length < 5) {
            $('#nameErr').html("minimum 5 & maximum 35 character require").fadeIn();
            nameErr = true;
        } else {
            $('#nameErr').text("");
            nameErr = false;
        }
    });

    $("#c_name").on("keyup", function () {
        c_name = $(this).val();

        if (c_name.length > 55 || c_name.length < 3) {
            $('#c_nameErr').html("minimum 3 & maximum 55 character require").fadeIn();
            c_nameErr = true;
        } else {
            $('#c_nameErr').text("");
            c_nameErr = false;
        }
    });

    $("#url").on("keyup", function () {
        url = $(this).val();

        if (url.length > 65 || url.length < 5) {
            $('#urlErr').html("minimum 5 & maximum 65 character require").fadeIn();
            urlErr = true;
        } else {
            $('#urlErr').text("");
            urlErr = false;
        }
    });

    $("#reason").on("keyup", function () {
        reason = $(this).val();

        if (reason.length > 85 || reason.length < 5) {
            $('#reasonErr').html("minimum 5 & maximum 85 character require").fadeIn();
            reasonErr = true;
        } else {
            $('#reasonErr').text("");
            reasonErr = false;
        }
    });


    $("#whatsapp").on("keyup", function () {
        whatsapp = $(this).val();

        if (whatsapp.length > 14 || whatsapp.length < 5) {
            $('#whatsappErr').html("minimum 5 & maximum 14 number require").fadeIn();
            whatsappErr = true;
        } else {
            $('#whatsappErr').text("");
            whatsappErr = false;
        }
    });

    $("#email").on("keyup", function () {
        email = $(this).val();
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (regex.test(email)) {
            $('#emailErr').text("");
            emailErr = false;

        } else {
            $('#emailErr').text("email must be valid");
            emailErr = true;
        }
    });

    $("#des").on("keyup", function () {
        des = $(this).val();

        if (des.length > 250 || des.length < 20) {
            $('#desErr').html("minimum 20 & maximum 250 number require").fadeIn();
            desErr = true;
        } else {
            $('#desErr').text("");
            desErr = false;
        }
    });

    $("form").on("submit", function () {
        event.preventDefault();

        if (nameErr == false && c_nameErr == false && urlErr == false && reasonErr == false && whatsappErr == false && emailErr == false && desErr == false) {
            var response = grecaptcha.getResponse();

            if (response.length == 0) {
                $("#captchaErr").text("Please verify you are not robot");
            }else{
                $.ajax({
                    url: "mail.php",
                    method: "POST",
                    data: $("#mail").serialize(),
                    success: function (result) {
                        $("#email_form").html(result);
                    }
                });

                $("#captchaErr").text();
            }
        }else{
            alert("Please fill up all field correctly");
        }
    });
});