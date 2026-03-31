const items = document.querySelectorAll('.item');
const slots = document.querySelectorAll('.drop-zone');

items.forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.id);

    e.target.classList.add('opacity-50');
  });

  item.addEventListener('dragend', e => {
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

    const id = e.dataTransfer.getData('text/plain');
    const dragItem = document.getElementById(id);

    // スロットが空の場合のみ追加
    if (dragItem && slot.children.length === 0) {
      slot.append(dragItem);
    }
  });
});