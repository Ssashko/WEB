<?
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == "POST")
    {
        if($_SERVER["CONTENT_TYPE"] ==  'application/json')
            $_POST = json_decode(file_get_contents('php://input'), true);
        if($_SESSION["auth"] != 1)
            sendMessage2('Помилка','Вам потрібно ввійти для цієї дії '.$_SESSION["auth"],0,"error",1);
        if(!checkinput4($_POST["data"]))
            sendMessage2('Помилка','Некоректний запит #5',0);
        mysqli_query($link, "INSERT INTO Cart VALUES ('','".date('Y-m-d')."','".date('h:i:s')."',".$_SESSION["id"].",'в обробці')");
        $cartid = mysqli_insert_id($link);
        foreach($_POST["data"] as $key => $value)
        {
            $price = mysqli_fetch_array(mysqli_query($link,"SELECT `price` FROM Goods WHERE `id` = ".$value["id"]));
            mysqli_query($link, "INSERT INTO CartItems VALUES (".$cartid.",".$value["id"].",".$value["count"].",".$price[0].")");
        }
        if(mysqli_errno($link))
            sendMessage2('Помилка','sql #1',0);
        sendMessage2('Повідомлення','Замовлення # '.$cartid.' оформленно',1,"ok");  
    }
    else
        sendMessage2('Помилка','Некоректний запит',0);

    function sendMessage2 ($title,$message,$type,$mtype = "error",$redirect = 0)
    {
        $ttype;
        switch($type){
            case 0 : $ttype = "redStyle";break;
            case 1 : $ttype = "greenStyle";
        }
        exit('{"mtype":"'.$mtype.'","title":"'.$title.'","message":"'.$message.'","type":"'.$ttype.'","redirect":"'.$redirect.'"}');
    }
    function checkinput4 (&$data)
    {
        foreach($data as $key => $value)
        {
            $value["id"] = htmlspecialchars($value["id"]);
            $value["count"] = htmlspecialchars($value["count"]);
            if(!preg_match("/^\d+$/",$value["id"]) || !preg_match("/^\d+$/",$value["count"]))
                return false;
        }
        return true;
    }
?>