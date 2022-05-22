<?
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == "POST")
    {
        
        if($_SERVER["CONTENT_TYPE"] ==  'application/json')
            $_POST = json_decode(file_get_contents('php://input'), true);
        if(!checkinput4($_POST["data"]))
            sendMessage2('Помилка','Некоректний запит #4',0);
        $growth = array();
        
        foreach($_POST["data"] as $key => $value)
        {
            $category = mysqli_fetch_array(mysqli_query($link,"SELECT `category` FROM Goods WHERE `id` = ".$value["id"]));
            $category = $category[0];
            if(!isset($growth[$category]))
                $growth[$category] = $value["count"];
            else
                $growth[$category] += $value["count"];
        }
        foreach($growth as $key => $value)
            mysqli_query($link,"UPDATE Statistic SET `count` = `count` + ".$value." WHERE `id` = ".$key);
        if(mysqli_errno($link))
            sendMessage2('Помилка','sql #3',0); 
        sendMessage5();
    }
    if ($method == "GET")
    {
        $sqlQ = mysqli_query($link,"SELECT `Name` as x, `count` as y FROM `Statistic` s INNER JOIN `Category` c ON s.`id` = c.`id`");

        $result = mysqli_fetch_all($sqlQ,MYSQLI_ASSOC);
        if(mysqli_errno($link))
            sendMessage2('Помилка','sql #6',0); 
        sendMessage6($result);
    }
    else
        sendMessage2('Помилка','Некоректний запит',0);


    function sendMessage6 (&$result)
    {
        exit('{"mtype":"ok", "data": '.json_encode($result).'}');
    }
    function sendMessage5 ()
    {
        exit('{"mtype":"ok"}');
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