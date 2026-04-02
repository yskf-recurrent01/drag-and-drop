<?php
require_once 'functions.php';

var_dump($_FILES);

$type = $_FILES['image']['type'];
$name = $_FILES['image']['name'];
$tmp_name = $_FILES['image']['tmp_name'];
$type = $_FILES['image']['size'];

$filepath_base = './images/';

$allowed_image_types = [
  IMAGETYPE_JPEG,
  IMAGETYPE_PNG,
  IMAGETYPE_WEBP,
];

$json = [
  'msg' => '',
  'filename' => '',
];

if ($_FILES['image']['error'] !== 0) return;

if (in_array(exif_imagetype($tmp_name), $allowed_image_types)) {
  move_uploaded_file($tmp_name, $filepath_base . $name);
} else {
  $json['msg'] = 'アップロードできる画像の種類はJPEG,PNG,WEBPのみです';
}
