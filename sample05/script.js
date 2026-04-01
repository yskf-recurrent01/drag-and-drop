window.addEventListener('DOMContentLoaded', async () => {
  const areas = Array.from(document.querySelectorAll('.area'));
  const todoData = await getTaskData();
  const statusData = await getStatusData();

  statusData.forEach(status => status.id = `area-${status.id}`);

  areas.forEach((area, i) => {
    area.id = statusData[i].id;
    area.querySelector('h2').innerText = statusData[i].status;
  });
  todoData.forEach(data => {
    let html = '';
    html = `<div id="item${data.id}" class="item bg-warning text-dark p-3 mb-2 rounded shadow-sm" style="cursor: pointer;" draggable="true">${data.title}</div>`;
    areas.find(area => area.id === `area-${data.status}`).innerHTML += html;
  });

  const items = document.querySelectorAll('.item');
  items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', e.target.id);
    });
  });
  areas.forEach(area => {
    area.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    area.addEventListener('drop', e => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const dragItem = document.getElementById(id);

      if (dragItem) {
        area.append(dragItem);
      }

      const idNum = parseInt(id.replace('item', ''));
      updateTask({
        id: idNum,
        status: area.id.replace('area-', ''),
      });
    })
  })
});

/**
 * タスクを取得する非同期関数
 *  * @returns {Array} JSONファイルのデータ
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
    body: JSON.stringify(dataObject),
  });
  if (res.ok) {
    const json = await res.json();
    // return json;
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
    alertWrapper.removeChild(alertElm);
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