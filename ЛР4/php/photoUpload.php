<?
    switch($_SERVER['REQUEST_METHOD'])
    {
        case "POST":
            {
                if(!isset($_FILES["image"]))
                    exit('{"status" : "error"}');
                $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $url = (getMaxNumName()+1).".".$ext;
                if(!move_uploaded_file($_FILES['image']['tmp_name'], $_SERVER['DOCUMENT_ROOT']."/img/goods/".$url))
                    exit('{"status" : "error"}');
                exit('{"status" : "ok", "url" : "'.$url.'"}');
            }
        break;
        default:
            exit('{"status" : "error"}');

    }
    
    function getMaxNumName()
    {
        $maxNum = 0;
        foreach (scandir($_SERVER['DOCUMENT_ROOT']."/img/goods") as $key => $value)
        {
            $arr = preg_split("/\./",$value);
            $num = intval($arr[0]);
            if($maxNum < $num)
                $maxNum = $num;
        }
        return $maxNum;
    }
?>