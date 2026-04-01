// すべてのアイテムを取得
const items = document.querySelectorAll('.item');
items.forEach(item => {
    // アイテムにイベントリスナーを登録
    item.addEventListener('click', e => {
        // クリックされたアイテムが存在するエリア(親要素)のidを取得
        let currentAreaId = e.target.parentElement.id;
        let targetAreaId = '';
        // 現在地と反対のエリアのidをセット
        if (currentAreaId === 'area-left') {
            targetAreaId = 'area-right';
        } else {
            targetAreaId = 'area-left';
        }
        const targetArea = document.getElementById(targetAreaId);
        // アイテムを目的地へ移動させる
        targetArea.append(e.target);
    });
});