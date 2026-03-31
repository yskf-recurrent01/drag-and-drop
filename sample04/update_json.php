<?php
// （推奨）JavaScript側がJSONとして処理しやすくなるヘッダー
header('Content-Type: application/json; charset=UTF-8');

$id = (int)($_GET['id'] ?? 0);
$status = $_GET['status'] ?? '';

$todo_raw = file_get_contents('./todo.json');
$todo_array = json_decode($todo_raw, true);

foreach ($todo_array as $key => $item) {
  if ($item['id'] === $id) {
    $todo_array[$key]['status'] = $status;
    break;
  }
}

// JSON_PRETTY_PRINT を追加すると、todo.jsonの中身が改行されて人が見やすくなります
$json = json_encode($todo_array, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

file_put_contents('./todo.json', $json);

// フロントエンド（JS側）に処理結果のJSONを返す（fetchのレスポンスとして必要になる場合があります）
echo $json;
