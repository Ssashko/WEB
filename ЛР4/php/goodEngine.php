<?
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == "POST")
    {
        
        if($_SERVER["CONTENT_TYPE"] ==  'application/json')
            $_POST = json_decode(file_get_contents('php://input'), true);
        if($_POST["good_load_type"] == "multi")
        {
            if(!checkinput1($_POST["category"],$_POST["prices_limit"]))
                sendMessage2('Помилка','Некоректний запит #1',0);
            $str_cat  = "(";
            foreach($_POST["category"] as $key => $value)
                $str_cat .= "c.`id` = ".$value." OR ";
            $str_cat = substr($str_cat,0,-4).")";
            $str_cat .= " AND g.price >= ".$_POST["prices_limit"]["0"]." AND g.price <= ".$_POST["prices_limit"]["1"];
            $str_cat = "SELECT g.`id`, g.`title`, g.`photoName`, g.`photoType` , g.`price`, c.`Name` FROM Goods g INNER JOIN Category c ON g.`category` = c.`id` WHERE". $str_cat;
            $sql_query = mysqli_query($link, $str_cat);
            if(!$sql_query)
                sendMessage2('Помилка','sql #1',0);
            $table_res = mysqli_fetch_all($sql_query,MYSQLI_ASSOC);
            sendMessage3($table_res);
        }
        else if($_POST["good_load_type"] == "single")
        {
            if(!checkinput2($_POST["id"]))
            sendMessage2('Помилка','Некоректний запит #2',0);
            $sql_query = mysqli_query($link, "SELECT `id`, `title`, `text`, `photoName`, `photoType` , `price` FROM Goods WHERE `id` = ".$_POST["id"]);
            if(!$sql_query)
                sendMessage2('Помилка','sql #2',0);
            $row_res = mysqli_fetch_assoc($sql_query);
            sendMessage4($row_res);
        }
        else if($_POST["good_load_type"] == "idmutli")
        {
            if(!checkinput3($_POST["ids"]))
                sendMessage2('Помилка','Некоректний запит #4',0);
            if(count($_POST["ids"]) == 0)
                sendMessage5();
            $str_cat  = "";
            foreach($_POST["ids"] as $key => $value)
                $str_cat .= "`id` = ".$value." OR ";
            $str_cat = substr($str_cat,0,-4);
            $str_cat = "SELECT `id`, `title`, `photoName`, `photoType` , `price` FROM Goods WHERE ". $str_cat;
            $sql_query = mysqli_query($link, $str_cat);
            if(!$sql_query)
                sendMessage2('Помилка','sql #3 SQL_QUERY : '. $str_cat,0);
            $table_res = mysqli_fetch_all($sql_query,MYSQLI_ASSOC);
            $data = array(
                "data" => $table_res,
            );
            sendMessage4($data);
        }
        else
            sendMessage2('Помилка','Некоректний запит #3',0);
    }
    else
    sendMessage2('Помилка','Некоректний запит $_POST : '. $_POST["mode"],0);

    function sendMessage5 ()
    {
        exit('{"mtype":"empty"}');
    }
    function sendMessage4 ($data)
    {
        $data["mtype"] = "update";
        exit(json_encode($data));
    }
    function sendMessage3 ($data)
    {
        exit('{"mtype":"update","data":'.json_encode($data).'}');
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
    function checkinput1 (&$categories,&$prices_limit)
    {
        
        foreach($categories as $key => $value)
        {
            $value = htmlspecialchars($value);
            if(!preg_match("/^\d+$/",$value))
                return false;
        }
        if(!preg_match("/^\d+$/",$prices_limit["0"]) || !preg_match("/^\d+$/",$prices_limit["1"]))
            return false;
        if(intval($prices_limit["0"]) > intval($prices_limit["1"]))
            return false;
        return true;
    }
    function checkinput2 (&$id)
    {
        $id = htmlspecialchars($id);
        return preg_match("/^\d+$/",$id);
    }
    function checkinput3 (&$ids)
    {
        foreach($ids as $key => $value)
        {
            $value = htmlspecialchars($value);
            if(!preg_match("/^\d+$/",$value))
                return false;
        }
        return true;
    }

?>