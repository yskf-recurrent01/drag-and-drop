const targets = document.querySelectorAll('.target');
const slots = document.querySelectorAll('.drop-zone');

let sourceSlot = null;

targets.forEach(target => {
  target.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.id);
    sourceSlot = e.target.parentElement; // ドラッグ元のスロットを記録
    e.target.classList.add('opacity-50');
  });

  target.addEventListener('dragend', e => {
    e.target.classList.remove('opacity-50');
  });
});

slots.forEach(slot => {
  // アイテムが重なった時
  slot.addEventListener('dragover', e => {
    e.preventDefault();
    slot.classList.add('drag-over');
  });

  // アイテムが離れた時
  slot.addEventListener('dragleave', e => {
    slot.classList.remove('drag-over');
  });

  // ドロップされた時
  slot.addEventListener('drop', e => {
    e.preventDefault();
    slot.classList.remove('drag-over');

    // もしドラッグ元のスロットとドロップ先が同じなら、何もしない
    if (sourceSlot === slot) return;

    const id = e.dataTransfer.getData('text/plain');
    const dragItem = document.getElementById(id);
    const targetItem = slot.children[0];

    // ドロップ先にアイテムがいれば、ドラッグ元のスロットへ避難させる（入れ替え）
    if (targetItem) {
      sourceSlot.append(targetItem);
    }
    
    // ドラッグしてきたアイテムをドロップ先に配置
    if (dragItem) {
      slot.append(dragItem);
    }
  });
});