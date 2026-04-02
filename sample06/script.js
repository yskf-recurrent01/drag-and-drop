const dropZone = document.getElementById('drop-zone');
const previewArea = document.getElementById('preview');

['dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropZone.addEventListener('dragover', (e) => {
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  console.log(files);
  if (handleFiles(files)) {
    console.log('画像です')
  } else {
    console.log('画像じゃないです')
  }

  dropZone.classList.remove('drag-over');
});

function handleFiles(files) {
  const file = files[0];
  console.log(file.type.match(/^image/));

  if (!file.type.match(/^image/)) return false;

  const render = new FileReader();
  render.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.maxWidth = '100%';
    previewArea.innerHTML = '';
    previewArea.append(img);
    // console.log(img);
  }
  render.readAsDataURL(file);

  uploadFile(file);

  return true;
}

function uploadFile(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = fetch('./upload_file.php', {
    method: 'post',
    body: formData,
  });

}