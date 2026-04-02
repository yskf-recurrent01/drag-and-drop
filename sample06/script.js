const dropZone = document.getElementById('drop-zone');
const previewArea = document.getElementById('preview');
const uploadBtn = document.getElementById('upload-btn');

const INVALID_FILE_TYPE = 1;
const UPLOAD_FAILED = 2;

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
  handleFiles(files);
  dropZone.classList.remove('drag-over');
});


function handleFiles(files) {
  const file = files[0];
  if (!checkFileType(file)) {
    showResultMessage({
      status: 'error',
      data: null,
      error: {
        code: INVALID_FILE_TYPE,
      }
    })
  } else {
    showPreview(file);
    uploadBtn.addEventListener('click', () => {
      uploadFile(file);
    })
  }
}

function checkFileType(file) {
  if (file.type.match(/^image/)) {
    return true
  } else {
    return false;
  }
}

function showResultMessage(json) {
  const resuleArea = document.getElementById('result-area');
  resuleArea.innerHTML = '';
  let className = '';
  let msg = '';
  if (json.status === 'success') {
    className = 'success';
    msg = `ファイルのアップロードに成功しました:<br> [${json.data.filename}]`;
  } else if (json.status === 'error') {
    className = 'danger';
    switch (json.error.code) {
      case INVALID_FILE_TYPE:
        msg = 'アップロードできるファイルの種類はJPEG,PNG,WEBPのみです';
        break;
      case UPLOAD_FAILED:
        msg = 'アップロードに失敗しました';
        break;
    }
  }

  const html = `<div class="alert alert-${className} text-center"><p>${msg}</p><button type="button" class="btn-close" aria-label="Close" id="alert-close-btn"></button></div>`;
  resuleArea.insertAdjacentHTML('beforeend', html);
  previewArea.innerHTML = '';
  document.getElementById('alert-close-btn').addEventListener('click', (e) => {
    resuleArea.innerHTML = '';
  });
}

function getResultMessage(json) {
  switch (json) {
    case INVALID_FILE_TYPE:
      return 'アップロードできるファイルの種類はJPEG,PNG,WEBPのみです';
    default:
      return '';
  }
}

function showPreview(file) {
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
  uploadBtn.removeAttribute('disabled');
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('./upload_file.php', {
    method: 'post',
    body: formData,
  });
  const json = await res.json();
  // console.log(json);
  showResultMessage(json);
  uploadBtn.disabled=true;
}

