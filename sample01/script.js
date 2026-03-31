const areas = document.querySelectorAll('.area');
const items = document.querySelectorAll('.item');

items.forEach(item => {
  // ドラッグ開始時の処理
  item.addEventListener('dragstart', (e) => {
    // データ転送用の識別子（ID）をセット
    e.dataTransfer.setData('text/plain', e.target.id);
    // ドラッグ中の要素を半透明にして「動かしている感」を出す
    e.target.classList.add('opacity-50');
  });

  // ドラッグ終了時の処理（ドロップの成否に関わらず実行）
  item.addEventListener('dragend', (e) => {
    e.target.classList.remove('opacity-50');
  });
});

areas.forEach(area => {
  // アイテムがエリアの上に重なっている間
  area.addEventListener('dragover', (e) => {
    e.preventDefault(); // これがないとドロップが許可されません
    // エリアを強調表示（青い枠線と背景色を変更）
    area.classList.add('border-primary', 'bg-white');
  });

  // アイテムがエリアから離れた時
  area.addEventListener('dragleave', (e) => {
    area.classList.remove('border-primary', 'bg-white');
  });

  // アイテムがエリアにドロップされた時
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    // ドロップしたので強調を解除
    area.classList.remove('border-primary', 'bg-white');

    // データ転送からIDを取得
    const id = e.dataTransfer.getData('text/plain');
    const dragItem = document.getElementById(id);

    if (dragItem) {
      area.append(dragItem);
    }
  });
});