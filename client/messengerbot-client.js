//클라이언트(메신저봇R bot) 작성 코드
'use strict';
var config = {
  address: '127.0.0.1', // Node.js 프로그램을 실행한 기기의 IP
  port: 3000,
};
var socket = new java.net.DatagramSocket();
var address = java.net.InetAddress.getByName(config.address);
var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 65535);
var generateId = function (len) {
  var result = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var _ = 0; _ < len; _++)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
var getBytes = function (str) {
  return new java.lang.String(str).getBytes();
};
var inPacket = new java.net.DatagramPacket(buffer, buffer.length);
var sendMessage = function (event, data) {
  var bytes = getBytes(JSON.stringify({ event: event, data: data }));
  var outPacket = new java.net.DatagramPacket(
    bytes,
    bytes.length,
    address,
    config.port
  );
  socket.send(outPacket);
};
var sendReply = function (session, success, data) {
  var bytes = getBytes(
    JSON.stringify({ session: session, success: success, data: data })
  );
  var outPacket = new java.net.DatagramPacket(
    bytes,
    bytes.length,
    address,
    config.port
  );
  socket.send(outPacket);
};
var handleMessage = function (msg) {
  var _a;
  var _b = JSON.parse(decodeURIComponent(msg)),
    event = _b.event,
    data = _b.data,
    session = _b.session;
  switch (event) {
    case 'sendText':
      var res = Api.replyRoom(
        data.room,
        ((_a = data.text) !== null && _a !== void 0 ? _a : '').toString()
      );
      sendReply(session, res);
      break;
  }
};
var send = function (msg) {
  sendMessage('chat', {
    room: msg.room,
    content: msg.msg,
    sender: msg.sender,
    isGroupChat: msg.isGroupChat,
    profileImage: msg.imageDB.getProfileBase64(),
    packageName: msg.packageName,
  });
};
var responseFix = function (
  room,
  msg,
  sender,
  isGroupChat,
  _,
  imageDB,
  packageName
) {
  return send({
    room: room,
    msg: msg,
    sender: sender,
    isGroupChat: isGroupChat,
    imageDB: imageDB,
    packageName: packageName,
  });
};

function onNotificationPosted(sbn, sm) {
  var packageName = sbn.getPackageName();
  if (!packageName.startsWith('com.kakao.tal')) return;
  var actions = sbn.getNotification().actions;
  if (actions == null) return;
  var userId = sbn.getUser().hashCode();
  for (var n = 0; n < actions.length; n++) {
    var action = actions[n];
    if (action.getRemoteInputs() == null) continue;
    var bundle = sbn.getNotification().extras;

    var msg = bundle.get('android.text').toString();
    var sender = bundle.getString('android.title');
    var room = bundle.getString('android.subText');
    if (room == null) room = bundle.getString('android.summaryText');
    var isGroupChat = room != null;
    if (room == null) room = sender;
    var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(
      packageName,
      action,
      room,
      false,
      ''
    );
    var icon = bundle
      .getParcelableArray('android.messages')[0]
      .get('sender_person')
      .getIcon()
      .getBitmap();
    var image = bundle.getBundle('android.wearable.EXTENSIONS');
    if (image != null) image = image.getParcelable('background');
    var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
    com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(
      packageName,
      room,
      action
    );
    if (this.hasOwnProperty('responseFix')) {
      responseFix(
        room,
        msg,
        sender,
        isGroupChat,
        replier,
        imageDB,
        packageName,
        userId != 0
      );
    }
  }
}
// @ts-ignore
var thread = new java.lang.Thread({
  run: function () {
    while (true) {
      socket.receive(inPacket);
      handleMessage(
        String(
          new java.lang.String(
            inPacket.getData(),
            inPacket.getOffset(),
            inPacket.getLength()
          )
        )
      );
    }
  },
});
var onStartCompile = function () {
  return thread.interrupt();
};
thread.start();
