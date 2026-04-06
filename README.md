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


# (補足)非同期通信(Ajax)でのデータ送信方法
JavaScriptの非同期通信(Ajax)において、サーバサイドへデータを送信する方法をまとめました。

## GET送信
リクエストURLにパラメータを付与して送信する方法です。主にデータの取得時に用います。

```javascript
async function getPostData(status,authorId){
    const endpoint = 'get_post_data.php';
    // ベースのURLに投稿のステータスと著者IDをパラメータとして付与
    const url = `${endpoint}?status=${status}&authorId=${authorId}`;
    const res = await fetch(url);

    if(res.ok){
        const json = await res.json();
        return json;
    }
}
// 投稿のステータスが下書きで、著者IDが1の記事を取得
getPostData('draft',1);
```

## POST送信
パラメータを使わずに送信する方法です。主に新しいデータの送信、登録時に使用します。

JavaScriptでは、HTMLの`<form>`タグで作成したフォームを介さずにPOST方式で送信することが可能です。

### JSON文字列として送信する

JavaScriptでPOST送信する方法の1つは、JSON文字列としてサーバーへ送る方法です。

文字列や数値といったデータは送信できますが、画像やCSVなどの**ファイルの送信はできません。**

```javascript
async function addUserData(userData){
    const endpoint = 'add_user_data.php';
    const res = await fetch(endpoint,{
        method: 'POST', // POST送信の指定
        headers: { // リクエストヘッダの設定
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(userData), // JSON文字列を送信
    });

    if(res.ok){
        const json = await res.json();
        return json;
    }
}

// 新規ユーザー「山田 太郎」の登録
addUserData( 
    {
        name: '山田 太郎',
        age: 25,
        hobby: ['読書','サイクリング']
    } 
);
```
#### `fetch()`メソッド
- 第1引数: データの送信先
- 第2引数: 送信オプション(オブジェクト)

第2引数では、送信方式、リクエストヘッダ、リクエスト本体などをオブジェクト形式で指定します。

#### `JSON.stringify()`メソッド
- 第1引数: JSON文字列に変換したいオブジェクトや値

引数として渡したオブジェクトや値をJSON文字列に変換するメソッドです。

#### PHPでの受信方法

サーバサイド(PHP)でデータを受け取る際、フォームでPOST送信されたデータを受け取る`＄_POST`では受け取ることができません。

```php
$user_data = $_POST; // JSON文字列は$_POSTでは受け取れない。
$user_data_json = file_get_content('php://input'); // JSON文字列を受け取りたいときはこうする
$user_data = json_decode($user_data_json,true); // JSON文字列のままでは取り扱えないので連想配列の形に変換
```

### フォームデータとして送信する

2つ目の方法は、JavaScriptで**フォームデータ**を作って送信する方法です。こちらの方法だと受信側は通常のフォームから送られてきた時と同じ処理でOKです。

また、文字列や数値だけでなくファイルを送信することもできます。送信したファイルは、PHPでは`$_FILES`で受け受け取ります。


```javascript
async function uploadImage(imageFile){
    const endpoint = 'upload_image.php';

    const formData = new FromData(); // 空のフォームデータを作成
    formData.append('image',imageFile); // フォームデータにキーと値をセットで追加(今回は画像ファイルを想定)
    
    const res = await fetch(endpoint,{
        method: 'POST', // POST送信の指定
        body: formData, // フォームデータを送信
    });

    if(res.ok){
        const json = await res.json();
        return json;
    }
}
uploadImage(imageFile);
```

#### `FromData`インターフェース
フォームとそこに含まれるキーと値のペアのセットを構築する。

#### `FormData.append()`メソッド
フォームオブジェクトにキーと値のペアを追加するメソッド。

## まとめ
利用シーンに応じて、適切な送信方法を選択して使いこなしましょう。