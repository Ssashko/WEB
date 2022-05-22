<?php
    if ( $_SERVER['REQUEST_URI'] == '/') $page = 'index';
    else {
        $page = substr($_SERVER['REQUEST_URI'],1);
        if (!preg_match('/^[A-z0-9]{3,20}$/', $page)){
         include_once 'html/page_404.html';
         exit;
        };
    };
    session_start();
    if($_SESSION["auth"] == 1)
        setcookie("auth",$_SESSION["privilege"]);
    else
        setcookie("auth", "", 0);
    include_once 'sql_connect.php';
    if($_SESSION["auth"] && ($page == 'login' || $page == "register"))
        include_once 'html/page_403.html';
    else if($page == "admin" && !($_SESSION["auth"] && $_SESSION["privilege"] >= 1))
        include_once 'html/page_403.html';
    else if($page == "account" && $_SESSION["auth"] != 1)
        include_once 'html/page_403.html';
    else if ( file_exists('html/'.$page.'.html')) 
        include_once 'html/'.$page.'.html';
    else if ( file_exists('php/'.$page.'.php'))
        include_once 'php/'.$page.'.php';
    else {
        include_once 'html/page_404.html';
    };
    
?>
