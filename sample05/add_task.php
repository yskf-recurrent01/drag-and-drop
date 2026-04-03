<?php
require_once 'functions.php';
$task_data_json = file_get_contents('php://input');
// echo $task_data_json;
$task_data = json_decode($task_data_json, true);

// var_dump($task_data);
$title = $task_data['taskTitle'];

try {
    $pdo = db_connect();
    $sql = 'INSERT INTO tasks (title) VALUES (:title)';
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':title', $title, PDO::PARAM_STR);
    $stmt->execute();
} catch (PDOException $e) {
    echo $e->getMessage();
}
