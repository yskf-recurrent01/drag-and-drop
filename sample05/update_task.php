<?php
// （推奨）JavaScript側がJSONとして処理しやすくなるヘッダー
require_once 'functions.php';
header('Content-Type: application/json; charset=UTF-8');

$json = file_get_contents('php://input');
$data = json_decode($json,true);

$id = (int)($data['id'] ?? 0);
$status = (int)$data['status'] ?? '';

try {
  $pdo = db_connect();
  $sql = 'UPDATE tasks SET status=:status,updated_at=now() WHERE id = :id';
  $stmt = $pdo->prepare($sql);
  $stmt->bindValue(':status', $status, PDO::PARAM_INT);
  $stmt->bindValue(':id', $id, PDO::PARAM_INT);
  $stmt->execute();
  $sql_task = 'SELECT tasks.title,statuses.status FROM tasks INNER JOIN statuses ON tasks.status = statuses.id WHERE tasks.id = :id';
  $stmt_task = $pdo->prepare($sql_task);
  $stmt_task->bindValue(':id', $id, PDO::PARAM_INT);
  $stmt_task->execute();
  $task = $stmt_task->fetch();
  http_response_code(200);
  $msg = [
    'msg' => '「'.$task['title'].'」のステータスを「'.$task['status'].'」へ変更しました。'
  ];
  echo json_encode($msg, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
  $error = [
    'msg' => $e->getMessage()
  ];
  http_response_code(500);
  echo json_encode($error, JSON_UNESCAPED_UNICODE);
} finally {
  exit();
}
