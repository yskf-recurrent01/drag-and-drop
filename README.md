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
## ドロップ可能なエリア
ほとんどの要素はデフォルトではドロップ可能な要素では**ありません。**

任意の要素をドロップ可能なエリアとするには、そのエリアの`dragover`イベントを`preventDefault()`でキャンセルする必要があります。
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

※安全にデータにアクセスするには`dragstart` と `drop` イベントの間に操作する。 
