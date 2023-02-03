/* TODO:
- 알람 기능 (socket 활용 방안 고안)
- 리팩토링 : 함수 mapping
- 리팩토링 : 상수 관리
- 테스트코드
*/

import { Server } from '@remote-kakao/core';
import LoggerPlugin from './plugins/logger';

const { onNotionMessage } = require('./controllers/notionController');

const server = new Server();
server.usePlugin(LoggerPlugin);

//FIXME: 응답지연됐을때 에러핸들링
server.on('message', async (msg) => {
  try {
    await onNotionMessage(msg);
  } catch (err) {
    console.error(err);
    msg.reply(`${err}`);
  }
});

server.start(3000);
