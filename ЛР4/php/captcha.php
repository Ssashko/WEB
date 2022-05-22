<?php
session_start();
$Random = strval(rand(100001, 999999));
$_SESSION['captcha'] = sha1(sha1($Random)."salt");
$im = imagecreatetruecolor(110, 30);
imagefilledrectangle($im, 0, 0, 110, 30, imagecolorallocate($im, 255, 255, 255));
for($i = 0; $i < rand(5,10);$i++)
{
    imagefilledrectangle($im,rand(0,110),rand(0,30),rand(0,110),rand(0,30),imagecolorallocate($im,rand(50,255), rand(50,255), rand(50,255)));
}
imagettftext($im, 40, rand(0,10), 15, 23, imagecolorallocate($im, 0, 0, 0), 'font/captcha.ttf', $Random);
for($i = 0; $i < rand(1,10);$i++)
{
    imageline($im,rand(0,110),rand(0,30),rand(0,110),rand(0,30),imagecolorallocate($im,rand(0,255), rand(0,255), rand(0,255)));
}
header('Expires: Wed, 1 Jan 1997 00:00:00 GMT');
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header ('Content-type: image/gif');
imagegif($im);
imagedestroy($im);
?>