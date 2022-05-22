<?
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == "POST")
    {
        if($_SERVER["CONTENT_TYPE"] ==  'application/json')
            $_POST = json_decode(file_get_contents('php://input'), true);
        if ($_POST["mode"] == "register")
        {
            if($_SESSION["auth"] == 1)
                sendMessage1('Помилка','Ви уже ввійшли!',0);
            if(!captchaValidate($_POST["captcha"]))
                sendMessage1('Помилка','Неправильна капча!',0);
            if(!passValidate($_POST["pass"]) || !loginValidate($_POST["login"]) || !emailValidate($_POST["email"]))
                sendMessage1('Помилка','Некоректний логін або пароль або електронна адреса',0);
            if(mysqli_num_rows(mysqli_query($link,"SELECT `id` FROM USER WHERE `login` = '".$_POST["login"]."' OR `email` = '".$_POST["email"]."'")))
                sendMessage1('Помилка','Логін зайнятий або e-mail уже зареєстрований',0);
            if(!mysqli_query($link,"INSERT INTO USER (`id`,`email`,`login`,`password`) VALUES ('','".$_POST["email"]."','".$_POST["login"]."','".$_POST["pass"]."')" ))
                sendMessage1('Помилка','реєстрація не вийшла',0);
            sendMessage1('Повідомлення','Успішно зареєстровано!',1,1);
        }
        else if ($_POST["mode"] == "login")
        {
            if($_SESSION["auth"] == 1)
                sendMessage1('Помилка','Ви уже ввійшли!',0);
            if(!captchaValidate($_POST["captcha"]))
                sendMessage1('Помилка','Неправильна капча!',0);
            if(!passValidate($_POST["pass"]) || !loginValidate($_POST["login"]))
                sendMessage1('Помилка','Некоректний логін або пароль',0);
            if(!mysqli_num_rows(mysqli_query($link,"SELECT `id` FROM USER WHERE `login` = '".$_POST["login"]."' AND `password` = '".$_POST["pass"]."'")))
                sendMessage1('Помилка','Акаунт не знайдено або не правильний пароль',0);
            $row = mysqli_fetch_assoc(mysqli_query($link,"SELECT * FROM USER WHERE `login` = '".$_POST["login"]."'"));
            foreach($row as $key => $value)
                $_SESSION[$key] = $value;
            $_SESSION["auth"] = 1;
            setcookie("auth",$_SESSION["privilege"]);
            sendMessage1('Повідомлення','Успішно авторизовано!',1,1);
        }
        else if ($_POST["mode"] == "relogin")
        {
            if($_SESSION["auth"] != 1)
                sendMessage1('Помилка','Ви уже вийшли!',0);
            unset($_SESSION["auth"]);
            setcookie("auth", "", 0);
            sendMessage1('Повідомлення','Ви успішно вийшли!',1,1);
        }
        else
        sendMessage1('Помилка','Некоректний запит $_POST : '. $_POST["mode"],0);
    }
    else
        sendMessage1('Помилка','Відправлено не POST',0);

    function sendMessage1 ($title,$message,$type,$redirect = 0)
    {
        $ttype;
        switch($type){
            case 0 : $ttype = "redStyle";break;
            case 1 : $ttype = "greenStyle";
        }
        exit('{"title":"'.$title.'","message":"'.$message.'","type":"'.$ttype.'","redirect":"'.$redirect.'"}');
    }
    function captchaValidate (&$str) {
        $str = htmlspecialchars($str);
        $exp = preg_match("/^\d{6}$/",$str);
        $str = sha1(sha1($str)."salt");
        return $exp && $_SESSION['captcha'] == $str;
        
    }
    function passValidate (&$str) {
        $str = htmlspecialchars($str);
        $exp = preg_match("/^(?=.{0,29}\d)(?=.{0,29}[!@#$%^&*])(?=.{0,29}[a-z])(?=.{0,29}[A-Z])[0-9a-zA-Z!@#$%^&*]{6,30}$/",$str);
        $str = sha1(sha1($str)+"salt");
        return $exp;
        
    }
    function loginValidate (&$str) {
        $str = htmlspecialchars($str);
        return preg_match("/^[A-Za-z_]\w{2,29}$/",$str);
    }
    function emailValidate (&$str) {
        $str = htmlspecialchars($str);
        return preg_match("/^[A-Za-z_.][A-Za-z0-9_.]{2,29}@[A-Za-z][A-Za-z0-9.]*\.[A-Za-z][A-Za-z0-9]*$/",$str);
    }
?>
