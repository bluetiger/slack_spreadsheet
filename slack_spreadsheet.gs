var slackAccessToken = '***********'; //token

//POST受け取り
function doPost(e){
  //Jsonパース
  var params = JSON.parse(e.postData.getDataAsString());
  if(params.type=="event_callback"){
    var data = params.event.text.split(',');
    //4つに分割出来たら処理（今回は日にち、内容、場所、その他の入力を想定
    if(data.length == 4){
      var date = data[0];
      var content = data[1];
      var place = data[2];
      var other = data[3];
      var user = params.event.user; //入力ユーザー
      var channelId = params.event.channel;//DMのチャンネルID
      sendreply(user,date,content,place,other,channelId);//確認用の返信DMへ
      writeSheet(user,date,content,place,other);//スプレッドシートに書き込み
      writeChannel(user,date,content,place,other);//チャンネルに書き込み
    }
    console.log(params);
  }
  return;
}

//GET受け取り→ポストへ
function doGet(e){
  doPost(e);
}

//確認用返信
function sendreply(user,date,content,place,other,channelId) {
  var slackApp = SlackApp.create(slackAccessToken);
  // 投稿するメッセージ
  var message =  "時間:"+date+"\n内容:"+content+"\n場所:"+place+"\nその他:"+other;
  var options = {
    // 投稿するユーザーの名前
    username: "ぼっとだよ～（〇・▽・〇）"
  }
  slackApp.postMessage(channelId, message, options);
}

//飲食注意タレコミチャンネルに書き込み
function writeChannel(user,date,content,place,other){
   var slackApp = SlackApp.create(slackAccessToken);
  // 対象チャンネル
  var channelId = '********';//ChannelId
  // 投稿するメッセージ
  var message =  "時間:"+date+"\n内容:"+content+"\n場所:"+place+"\nその他:"+other;
  var options = {
    // 投稿するユーザーの名前
    username: "ぼっとだよ～（〇・▽・〇）"
  }
  slackApp.postMessage(channelId, message, options);
}

//スプシ書き込み
function writeSheet(user,date,content,place,other){
    var mySheet = SpreadsheetApp.openById('**************');//スプレッドシートId
    mySheet.getSheets()[0].appendRow([user,date,content,place,other]);
}