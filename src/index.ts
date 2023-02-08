/* TODO:
- 알람 기능 (socket 활용 방안 고안)
- 리팩토링 : 함수 mapping
- 테스트코드
*/

import { Server } from '@remote-kakao/core';
import LoggerPlugin from './plugins/logger';

const notionController = require('./controllers/notionController');
const openAiController = require('./controllers/openAiController.js');

const server = new Server();
server.usePlugin(LoggerPlugin);

try {
  server.on('message', async (msg) => {
    try {
      await notionController.onNotionMessage(msg);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  });
} catch (err) {
  console.error(err);
}

try {
  server.on('message', async (msg) => {
    try {
      await openAiController.onOpenAiMessage(msg);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  });
} catch (err) {
  console.error(err);
}

server.start(3000);
