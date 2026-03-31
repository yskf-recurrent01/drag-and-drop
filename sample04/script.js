window.addEventListener('DOMContentLoaded', async () => {
  const areas = Array.from(document.querySelectorAll('.area'));
  const todoData = await loadJSON('./todo.json');

  todoData.forEach(data => {
    let html = '';
    html = `<div id="item${data.id}" class="item bg-warning text-dark p-3 mb-2 rounded shadow-sm" style="cursor: pointer;" draggable="true">${data.title}</div>`;
    areas.find(area => area.id === data.status).innerHTML += html;
  });

  const items = document.querySelectorAll('.item');
  items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      console.log(e.target.id);
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
      sendUpdateData({
        id: idNum,
        status: area.id,
      });

    })
  })
});

/**
 * JSONファイルを読み込む非同期関数
 * @param {String} target 読み込むJSONファイルのパス
 * @returns {Array} JSONファイルのデータ
 */
async function loadJSON(target) {
  let res = await fetch(target);
  if (res.ok) {
    let json = await res.json();
    return json;
  }
}

/**
 * 
 * @param {Object} dataObject JSONデータ更新に必要な値の配列
 */
async function sendUpdateData(dataObject) {
  const res = await fetch(`./update_json.php?id=${dataObject.id}&status=${dataObject.status}`);
  const text = await res.text();
  console.log(text);
}