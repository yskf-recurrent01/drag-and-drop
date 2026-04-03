window.addEventListener('DOMContentLoaded', async () => {
  // イベントリスナーの登録
  setupEventListener();
  init();
  // const areas = Array.from(document.querySelectorAll('.area'));
  // // タスクのデータをDBから取得
  // const taskData = await getTaskData();
  // // ステータスのデータをDBから取得
  // const statusData = await getStatusData();

  // areas.forEach((area, i) => {
  //   // ステータスエリアにデータをセット
  //   area.id = `area-${statusData[i].id}`;
  //   area.dataset.areaId = statusData[i].id;
  //   area.querySelector('h2').innerText = statusData[i].status;
  // });

  // renderTasks(taskData, areas);
  // taskData.forEach(task => {
  //   // タスクのアイテムを作成し、各ステータスのエリアへ挿入
  //   let html = '';
  //   html = `<div id="item${task.id}" data-item-id="${task.id}" class="item bg-warning text-dark p-3 mb-2 rounded shadow-sm" style="cursor: pointer;" draggable="true">${task.title}</div>`;
  //   areas.find(area => parseInt(area.dataset.areaId) === parseInt(task.status)).insertAdjacentHTML('beforeend', html);
  // });


  // const items = document.querySelectorAll('.item');
  // console.log(items)
  // // タスクアイテムのドラッグ処理
  // items.forEach(item => {
  //   item.addEventListener('dragstart', (e) => {
  //     e.dataTransfer.setData('text/plain', e.target.dataset.itemId);
  //     console.log(e.target.dataset.itemId)
  //   });
  // });
  // areas.forEach(area => {
  //   area.addEventListener('dragover', (e) => {
  //     e.preventDefault();
  //   });
  //   area.addEventListener('drop', e => {
  //     e.preventDefault();
  //     const itemId = e.dataTransfer.getData('text/plain');
  //     const dragItem = document.querySelector(`[data-item-id="${itemId}"]`);

  //     if (dragItem) {
  //       area.append(dragItem);
  //     }
  //     updateTask({
  //       id: parseInt(itemId),
  //       status: parseInt(area.dataset.areaId),
  //     });
  //   })
  // });

  // const openBtn = document.getElementById('open-btn');
  // const cancelBtn = document.getElementById('cancel-btn');
  // const addBtn = document.getElementById('add-btn');
  // const modal = document.getElementById('modal');

  // openBtn.addEventListener('click', () => {
  //   modal.showModal();
  // });

  // cancelBtn.addEventListener('click', () => {
  //   modal.close();
  // });

  // addBtn.addEventListener('click', async () => {
  //   const taskTitle = document.getElementById('task-title').value;
  //   addTask({ taskTitle: taskTitle });
  //   modal.close();
  //   const reacentTaskData = await getTaskData();
  //   renderTasks(reacentTaskData, areas);
  // });

});



/**
 * タスクの新規登録関数
 * @param {Object} newTaskData 新規登録するタスクのデータ 
 */
async function addTask(newTaskData) {
  const res = await fetch('./add_task.php', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTaskData), // JSON文字列を送信
  });
  if (res.ok) {

  }
  // 画面を再描画する。レンダリングの処理を関数化する。
}


/**
 * タスクを取得する非同期関数
 *  * @returns {Array} タスクのJSONデータ
 */
async function getTaskData() {
  let res = await fetch('./get_task_data.php');
  if (res.ok) {
    let json = await res.json();
    return json;
  }
}

/**
 * ステータスを取得する非同期関数
 * @returns ステータスのJSONデータ
 */
async function getStatusData() {
  let res = await fetch('./get_status_data.php');
  if (res.ok) {
    let json = await res.json();
    return json;
  }
}

/**
 * tasksテーブルを更新する非同期関数
 * @param {Object} dataObject DB更新に必要な値の配列
 */
async function updateTask(dataObject) {
  const res = await fetch('./update_task.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataObject), // JSON文字列を送信
  });
  if (res.ok) {
    const json = await res.json();
    showMsg(json);
  }
}

function showMsg(json) {
  // メッセージ表示領域を取得
  const alertWrapper = document.getElementById('alert-wrapper');
  // 中身を空にしておく
  alertWrapper.innerHTML = '';
  // メッセージ用の要素を作成
  const alertElm = document.createElement('div');
  alertElm.classList.add('alert', 'alert-success');
  alertElm.role = 'alert';
  // メッセージのテキストを挿入
  alertElm.insertAdjacentText('afterbegin', json.msg);
  // 表示領域へメッセージ要素を挿入
  alertWrapper.insertAdjacentElement('afterbegin', alertElm);
  // アニメーションの設定
  setupAlertAnimation(alertElm);
  // 一定時間経過したらDOMから削除
  setTimeout(() => {
    if (alertWrapper.contains(alertElm)) {
      alertWrapper.removeChild(alertElm);
    }
  }, 3000);
}

function setupAlertAnimation(alertElm) {
  const keyframes = [
    { opacity: '1', translate: '0 0', },
    { opacity: '0', translate: '0 -20px', easing: 'ease-out' }
  ];
  const options = {
    duration: 500,
    iterations: 1,
    delay: 2000,
    fill: "forwards",

  };
  alertElm.animate(keyframes, options);
}

async function init() {
  // タスクデータの取得
  const taskData = await getTaskData();
  // ステータスのデータをDBから取得
  const statusData = await getStatusData();
  // 各ステータスエリアセットアップ
  const areas = setupStatusArea(statusData);
  // タスクアイテムの生成・描画
  const items = await renderTasks(taskData, areas);
  console.log(items)

}

function setupStatusArea(statusData) {
  console.log(statusData);
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
  items = [];
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
      modal.close();
      init();
    } catch (error) {
      console.error(error);
    }
  });
}