# HTML ドラッグ&ドロップ API の基本
Webブラウザーでドラッグ&ドロップ機能を使用したUI開発には、**HTML ドラッグ&ドロップ API** を利用します。

## 概念
ドラッグ操作には次の3つの要素が含まれます。
- ドラッグされるアイテム
- 背後で転送されるデータ
- ドロップ可能なエリア

## ドラッグイベント
ユーザーがドラッグ操作をしている間、いくつかのイベントが発生します。

### ドラッグされる要素
|イベント|発生条件|
|:---|:---|
|**dragstart**|ドラッグ可能なアイテムのドラッグが開始されたとき|
|**drag**|ドラッグ可能なアイテムがドラッグされているとき|
|**dragend**|ドラッグ可能なアイテムのドラッグが終了したとき|

### ドロップ可能なエリア要素
|イベント|発生条件|
|:---|:---|
|**dragenter**|要素にドラッグ可能なアイテムが入ってきたとき|
|**dragleave**|要素からドラッグ可能なアイテムが出ていくとき|
|**dragover**|要素の上をドラッグ可能なアイテムがドラッグされているとき|
|**drop**|要素の上にドラッグ可能なアイテムがドロップされたとき|

## ドラッグ可能なアイテム
任意の要素をドラッグ可能にするには `draggable` 属性の値を `true`に設定します。 

```html
<p id="item1" draggable="true">この要素はドラッグ可能です。</p>
```

なお、画像やリンクなどはデフォルトでドラッグ可能な要素です。

## データの転送
ドラッグされている要素に関するデータを保持するには専用のデータストアである`DataTransfer`オブジェクトを利用します。

`DataTransfer`オブジェクトにアクセスするにはドラッグイベントオブジェクトの`dataTransfer`プロパティを使います。

```javascript
const item1 = document.getElementById('item1');
item1.addEventListener('dragstart', (e) => {
    // ドラッグしているアイテムのidをDataTransferオブジェクトにセット
    e.dataTransfer.setData('text/plain',e.target.id); 
});
```

なお、**ブラウザの外**からファイル(画像、CSV、JSON、PDF等)を、ドロップ可能なエリアへドロップし、データを取り込むことも可能です。

取り込んだデータをサーバサイドへ送信して、ファイルのアップロードやCSVデータを読み込んでDBへ登録するなどの処理へ繋げられます。

## ドロップ可能なエリア
ほとんどの要素はデフォルトではドロップ可能な要素では**ありません。**

任意の要素をドロップ可能なエリアとするには、そのエリアの`dragover`、`drop`イベントを`preventDefault()`でキャンセルする必要があります。
```html
<div id="drop-zone">ドロップゾーン</div>
```
```javascript
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', (e) => {
    // dragoverイベントをe.preventDefault()でキャンセル
    e.preventDefault();
});
dropZone.addEventListener('drop',(e) => {
    // dropイベントをe.preventDefault()でキャンセル
    e.preventDefault();
    // DataTransferオブジェクトにセットされていたidを取得
    const id = e.dataTrasfer.getData('text/plain');
    // ドラッグされていたアイテムの要素を取得
    const dragItem = document.getElementById(id);
    // ドロップ可能エリアにドラッグアイテムを追加
    if(dragItem){
        dropZone.append(dragItem);
    }
});
```

## ドラッグアイテムのデータを操作するメソッド 
### DataTransfer.setData(format,data)
ドラッグ可能なアイテムのデータを`DataTransfer`へセットするメソッド。
#### 引数
- **format**: 追加するデータの型(text/plainなど)
- **data**: 追加したいデータ
#### 戻り値
- なし

### DataTransfer.getData(format)
`DataTransfer`にセットしたデータを取り出すメソッド。
#### 引数
- **formt**: 受け取るデータの型を指定する
#### 戻り値
- 引数`format`で指定した型のデータ

※安全にデータにアクセスするには`dragstart` と `drop` イベントの間に操作しましょう。 

## (補足) JavaScriptでファイルをサーバーへ送信する方法
HTMLの`<form>`を介さずに、ファイルをサーバサイドにPOST送信する場合は`FormData`クラスを利用します。

※テキストデータであればJSON形式などで可。ただしPHP側での受け取り方に注意。`$_POST`では受け取れない。

### 空のフォームを作成
```javascript
const formData = new FormData();
```

### フォームにデータをセット
```javascript
// formData.append(key,value);
formData.append('user_name',userName);
formData.append('image',file);
```
**「key:value」** のペアでデータが送信されます。開発者ツールのネットワークで確認しよう。

### fetch()メソッドでフォームデータを送信
```javascript
// フォームデータを送信する非同期関数
async function sendData(){
    const res = await fetch('https://test.com/upload.php',{
        method: 'post', // 送信方式
        body: formData, // 送信内容
    });
    const json = await res.json();
    console.log(json.msg);
}

sendData(); // 関数の実行
```
このように送信すれば `https://test.com/upload.php` で `$_POST` や `$_FILES` でのデータの受け取り・操作が可能になります。
