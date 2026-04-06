window.addEventListener('DOMContentLoaded', async () => {
  // イベントリスナーの登録
  setupEventListener();
  init();
});

// 初期化関数
async function init() {
  // タスクデータの取得
  const taskData = await getTaskData();
  // ステータスのデータをDBから取得
  const statusData = await getStatusData();
  // 各ステータスエリアセットアップ
  const areas = setupStatusArea(statusData);
  // タスクアイテムの生成・描画
  const items = await renderTasks(taskData, areas);
}

function setupStatusArea(statusData) {
  const areas = Array.from(document.querySelectorAll('.area'));
  areas.forEach((area, i) => {
    area.dataset.statusId = statusData[i].id;
    area.querySelector('h2').textContent = statusData[i].status;
    const children = [...area.children];
    children.forEach((child, i) => {
      if (i > 0) child.remove();
    });
  });
  return areas;
}

async function renderTasks(taskData, areas) {
  const items = [];
  taskData.forEach(task => {
    // タスクのアイテムを作成し、各ステータスのエリアへ挿入
    let itemElm = document.createElement('div');
    itemElm.classList.add('item', 'bg-warning', 'text-dark', 'p-3', 'mb-2', 'rounded', 'shadow-sm');
    itemElm.dataset.taskId = task.id;
    itemElm.draggable = true;
    itemElm.style.cursor = 'pointer';
    itemElm.textContent = task.title;
    const targetArea = areas.find(area => parseInt(area.dataset.statusId) === parseInt(task.status));
    targetArea.insertAdjacentElement('beforeend', itemElm);
    items.push(itemElm);
  });
  return items;
}


function setupEventListener() {
  // タスクアイテム
  // イベントバブリングを利用し、アイテムの先祖(document)でイベントをキャッチ
  document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('item')) {
      e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
    }
  });

  // ドロップエリア
  // イベントバブリングを利用し、アイテムの先祖(document)でイベントをキャッチ
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    const deleteArea = e.target.closest('.delete-area');
    if (deleteArea) {
      deleteArea.classList.add('bg-danger', 'text-white');
    }
  });
  document.addEventListener('dragleave', (e) => {
    e.preventDefault();
    const deleteArea = e.target.closest('.delete-area');
    if (deleteArea) {
      deleteArea.classList.remove('bg-danger', 'text-white');
    }
  });
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const targetArea = e.target.closest('.area');
    if (targetArea) {
      const taskId = e.dataTransfer.getData('text/plain');
      const dragItem = document.querySelector(`[data-task-id="${taskId}"]`);
      if (dragItem) {
        targetArea.append(dragItem);
      }
      updateTask({
        id: parseInt(taskId),
        status: parseInt(targetArea.dataset.statusId),
      });
    }
    const deleteArea = e.target.closest('.delete-area');
    if (deleteArea) {
      const taskId = e.dataTransfer.getData('text/plain');
      if (confirm('このタスクを削除しますか？')) {
        deleteTask(taskId);
      }
      deleteArea.classList.remove('bg-danger', 'text-white');
    }

  });

  // ボタン
  const openBtn = document.getElementById('open-btn');
  const addBtn = document.getElementById('add-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const modal = document.getElementById('modal');

  // モーダルを開く
  openBtn.addEventListener('click', () => {
    modal.showModal();
  });

  // モーダルを閉じる
  cancelBtn.addEventListener('click', () => {
    modal.close();
  });

  // 新規タスクの登録
  addBtn.addEventListener('click', async () => {
    const taskTitle = document.getElementById('task-title').value;
    const newTaskData = { title: taskTitle };
    addTask(newTaskData);
  });
}

/**
 * タスクの新規登録関数
 * @param {Object} newTaskData 新規登録するタスクのデータ 
 */
async function addTask(newTaskData) {
  try {
    const res = await fetch('add_task.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTaskData)
    });

    // 通信エラーが発生したら例外をスロー
    if (!res.ok) throw new Error('通信エラーが発生しました。');

    const json = await res.json();
    // メッセージを表示
    showMsg(json);

    // モーダルを閉じて画面を再描画
    const modal = document.getElementById('modal');
    modal.close();
    init();
  } catch (error) {
    console.error(error);
  }
}

/**
 * タスクを取得する非同期関数
 *  * @returns {Array} タスクのJSONデータ
 */
async function getTaskData() {
  try {
    let res = await fetch('./get_task_data.php');
    if (!res.ok) throw new Error('タスクデータの取得に失敗しました');
    let json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
    showMsg({ msg: 'エラー: ' + error.message });
  }
}

/**
 * ステータスを取得する非同期関数
 * @returns ステータスのJSONデータ
 */
async function getStatusData() {
  try {
    let res = await fetch('./get_status_data.php');
    if (!res.ok) throw new Error('ステータスデータの取得に失敗しました');
    let json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
    showMsg({ msg: 'エラー: ' + error.message });
  }
}

/**
 * tasksテーブルを更新する非同期関数
 * @param {Object} dataObject DB更新に必要な値の配列
 */
async function updateTask(dataObject) {
  try {
    const res = await fetch('./update_task.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataObject), // JSON文字列を送信
    });
    if (!res.ok) throw new Error('更新に失敗しました');
    const json = await res.json();
    showMsg(json);
  } catch (error) {
    console.error(error);
    showMsg({ msg: 'エラー: ' + error.message });
  }
}

async function deleteTask(taskId) {
  try {
    const res = await fetch('delete_task.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId }),
    });
    if (!res.ok) throw new Error('削除に失敗しました');
    const json = await res.json();
    showMsg(json);
    init();
  } catch (error) {
    console.error(error);
  }
}

// メッセージの表示
function showMsg(json) {
  const toast = document.createElement('div');
  toast.popover = 'manual';
  toast.classList.add('msg-toast', 'alert', 'alert-success', 'shadow', 'p-3');
  toast.textContent = json.msg;

  document.body.append(toast);
  toast.showPopover();

  repositionToasts();

  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.hidePopover();
      toast.remove();
      repositionToasts();
    }
  }, 3000);
}

// トーストの位置調整用関数
function repositionToasts() {
  const toasts = Array.from(document.querySelectorAll('.msg-toast'));
  let currentOffset = 20;
  toasts.forEach(toast => {
    toast.style.bottom = `${currentOffset}px`;
    currentOffset += toast.offsetHeight + 10;
  });
}