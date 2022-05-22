<?
    switch($_SERVER['REQUEST_METHOD'])
    {
        case "POST":
            {
                $_POST = json_decode(file_get_contents('php://input'), true);
                if(!preg_match("/^\d+$/",$_POST["category"]))
                    sendMessage("Помилка","id категії повинен бути додатним числом",0);
                if(!preg_match("/^(?:\+|\-)?\d+$/",$_POST["price"]))
                    sendMessage("Помилка","ціна повинна бути числом",0);
                if($_POST["photoName"] == "" || $_POST["photoType"] == "")
                    sendMessage("Помилка","Задайте фотографію!",0);
                if(!mysqli_query($link,"INSERT INTO Goods VALUES ('','".$_POST["title"]."','".$_POST["text"]."','".$_POST["photoName"]."',".$_POST["price"].",".$_POST["category"].",'".$_POST["photoType"]."')"))
                    sendMessage("Помилка","Помилка sql #2",0);
                sendMessage("Повідомлення","пропозицію успішно додано",1,"ok");
            }
        break;
        case "PUT":
            {
                $_PUT = json_decode(file_get_contents('php://input'), true);
                $sqlQ = "";
                if(!preg_match("/^\d+$/",$_PUT["id"]))
                    sendMessage("Помилка","id повинен бути додатним числом",0);
                if($_PUT["category"] != "" && !preg_match("/^\d+$/",$_PUT["category"]))
                    sendMessage("Помилка","id категії повинен бути додатним числом",0);
                if($_PUT["price"] != "" && !preg_match("/^(?:\+|\-)?\d+$/",$_PUT["price"]))
                    sendMessage("Помилка","ціна повинна бути числом",0);
                if($_PUT["title"] != "")
                    $sqlQ .= " `title` = '".$_PUT["title"]."',";
                if($_PUT["text"] != "")
                    $sqlQ .= " `text` = '".$_PUT["text"]."',";
                if($_PUT["price"] != "")
                    $sqlQ .= " `price` = ".$_PUT["price"].",";
                if($_PUT["category"] != "")
                    $sqlQ .= " `category` = ".$_PUT["category"].",";
                if($_PUT["photoName"] != "" && $_PUT["photoType"] != "")
                {
                    $sqlQ .= " `photoName` = '".$_PUT["photoName"]."',";
                    $sqlQ .= " `photoType` = '".$_PUT["photoType"]."',";
                }
                if($sqlQ == "")
                    sendMessage("Повідомлення","Пропозиція не змінена, бо зміни не задані",1,"ok");
                $sqlQ = substr($sqlQ,0,-1);
                if(!mysqli_query($link,"UPDATE Goods SET".$sqlQ." WHERE `id` = ".$_PUT['id']))
                    sendMessage("Помилка","Помилка sql #3",0);
                if(!mysqli_affected_rows($link))
                    sendMessage("Помилка","id не знайдено",0);
                sendMessage("Повідомлення","пропозицію успішно змінена",1,"ok");
            }
        break;
        case "DELETE":
            {
                $_DELETE = json_decode(file_get_contents('php://input'), true);
                if(!preg_match("/^\d+$/",$_DELETE["id"]))
                    sendMessage("Помилка","id повинен бути додатним числом",0);
                if(!mysqli_query($link,"DELETE FROM Goods WHERE `id` = ".$_DELETE["id"]))
                    sendMessage("Помилка","Помилка sql #1",0);
                if(!mysqli_affected_rows($link))
                    sendMessage("Помилка","id не знайдено",0);
                sendMessage("Повідомлення","пропозицію успішно видалено",1,"ok");
            }
        break;
        default:
            sendMessage("Помилка","Некоректний запит",0);
    }

    function sendMessage ($title,$message,$type,$mtype = "error",$redirect = 0)
    {
        $ttype;
        switch($type){
            case 0 : $ttype = "redStyle";break;
            case 1 : $ttype = "greenStyle";
        }
        exit('{"mtype":"'.$mtype.'","title":"'.$title.'","message":"'.$message.'","type":"'.$ttype.'","redirect":"'.$redirect.'"}');
    }


?>