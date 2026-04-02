<?php
require_once 'functions.php';

// var_dump($_FILES);
define('INVALID_FILE_TYPE', 1);
define('UPLOAD_FAILED', 2);

$type = $_FILES['image']['type'];
$name = $_FILES['image']['name'];
$tmp_name = $_FILES['image']['tmp_name'];
$type = $_FILES['image']['size'];

$filepath_base = 'images/';

$allowed_image_types = [
  IMAGETYPE_JPEG,
  IMAGETYPE_PNG,
  IMAGETYPE_WEBP,
];

$json = [
  'status' => 'success',
  'data' => null,
  'error' => [
    'code' => null,
  ]
];

if ($_FILES['image']['error'] === 0) {
  if (in_array(exif_imagetype($tmp_name), $allowed_image_types)) {
    $filename = $filepath_base . $name;
    move_uploaded_file($tmp_name, $filename);
    $json = [
      'status' => 'success',
      'data' => ['filename' => $filename],
      'error' => null
    ];
  } else {
    $json = [
      'status' => 'error',
      'data' => null,
      'error' => [
        'code' => INVALID_FILE_TYPE,
      ],
    ];
  }
} else {
  $json = [
    'status' => 'error',
    'data' => null,
    'error' => [
      'code' => UPLOAD_FAILED,
    ],
  ];
}
echo json_encode($json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit();