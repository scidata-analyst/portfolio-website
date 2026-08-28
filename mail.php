<✦php
    if(isset($_POST['name'])){
        $name = $_POST['name'];
        $c_name = $_POST['c_name'];
        $s_name = $_POST['s_name'];
        $p_name = $_POST['p_name'];
        $b_link = $_POST['b_link'];
        $reason = $_POST['reason'];
        $budget = $_POST['budget'];
        $whatsapp = $_POST['whatsapp'];
        $email = $_POST['email'];
        $des = $_POST['des'];

        $text = 'Hey there, </br></br> My name is '.$name.', I work for '.$c_name.' we might interest to use your '.$s_name.' services. We are popular at '.$p_name.'. Here is our business profile link '.$b_link.' I would like to work with kanchonwevdev because '.$reason.'. We will invest '.$budget.' USD in this project. You can reach me at '.$whatsapp.' or get in touch by email at '.$email.'. </br></br> Project details '.$des.'. </br></br></br> Thanks </br>'.$name;

        $to = "kanchonkumar49@gmail.com";
        $subject = $s_name;
        $message = $text;
        $headers = "From: ".$email."\r\n";
        $headers .= "Reply-To: ".$email."\r\n";
        $headers .= "Content-Type: text/html\r\n";


        $mail_sent = mail($to, $subject, $message, $headers);

        if ($mail_sent) {
            echo "Hey, ".$email;
            echo "</br></br> You got your email successfully. Our team will be contact you.";
        } else {
            echo "Email sending failed.";
        }
    }
