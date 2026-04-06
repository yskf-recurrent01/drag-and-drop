<?php
require_once 'functions.php';
$task_data_json = file_get_contents('php://input');
$task_data = json_decode($task_data_json, true);

$id = (int)$task_data['id'];

try {
    $pdo = db_connect();
    $sql = 'DELETE FROM tasks WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['msg' => 'タスクを削除しました。']);
} catch (PDOException $e) {
    echo $e->getMessage();
}
