<?php
require_once 'functions.php';

try {
    $pdo = db_connect();
    $sql = 'SELECT id,title,status FROM tasks';
    $stmt = $pdo->query($sql);
    $result = $stmt->fetchAll();
    http_response_code(200);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {

    $error = [
        'msg' => $e->getMessage()
    ];
    http_response_code(500);
    echo json_encode($error, JSON_UNESCAPED_UNICODE);
} finally {
    exit();
}
