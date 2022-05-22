<?
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == "GET")
    {
        $userdata = mysqli_fetch_assoc(mysqli_query($link,'SELECT `id`, `login`, `email`, `privilege` FROM USER WHERE `id` = "'.$_SESSION["id"].'"'));
        $ordersinfo = mysqli_fetch_all(mysqli_query($link,'SELECT `id`, `date`, `time`, `status` FROM Cart WHERE `customer` = "'.$_SESSION["id"].'"'),MYSQLI_ASSOC);
        if(mysqli_errno($link))
            sendMessage2('Помилка','sql #5',0); 
        sendMessage3($userdata,$ordersinfo);
    }
    else
        sendMessage2('Помилка','Некоректний запит',0);

    function sendMessage3 (&$userdata,&$ordersinfo)
    {
        exit('{"mtype":"ok","userdata":'.json_encode($userdata).',"ordersinfo" : '.json_encode($ordersinfo).'}');
    }
    function sendMessage2 ($title,$message,$type,$redirect = 0)
    {
        $ttype;
        switch($type){
            case 0 : $ttype = "redStyle";break;
            case 1 : $ttype = "greenStyle";
        }
        exit('{"mtype":"alert","title":"'.$title.'","message":"'.$message.'","type":"'.$ttype.'","redirect":"'.$redirect.'"}');
    }
?>