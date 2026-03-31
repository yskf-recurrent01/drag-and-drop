const areas = document.querySelectorAll('.area');
const items = document.querySelectorAll('.item');
items.forEach(item => {
    item.addEventListener('click', e => {
        let currentAreaId = e.target.parentElement.id;
        let targetAreaId = '';
        if (currentAreaId === 'area-left') {
            targetAreaId = 'area-right';
        } else {
            targetAreaId = 'area-left';
        }

        const targetArea = document.getElementById(targetAreaId);
        targetArea.append(e.target);
    });
});