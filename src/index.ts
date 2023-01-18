import { Server, Message } from '@remote-kakao/core';
// import KakaoLinkPlugin from '@remote-kakao/kakaolink-plugin';
import LoggerPlugin from './plugins/logger';

const notionService = require('./services/notionService');

const prefix = '>';
const server = new Server();

server.usePlugin(LoggerPlugin);
// server.usePlugin(KakaoLinkPlugin, config);

server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === 'ping') {
    /*
      pingTest
    */
    const timestamp = Date.now();
    await msg.reply('Pong!');
    msg.reply(`${Date.now() - timestamp}ms`);
  }

  // if (cmd === '투두벌금') {
  //   let result = await notionService.getTodayPenaltyList();
  //   await msg.reply(result);
  // }

  // if (cmd === '투두 리스트') {
  //   let result = await notionService.getListTodoWriters();
  //   await msg.reply(result);
  // }

  if (cmd === '팀원') {
    let result = await notionService.getTeamMembers();
    await msg.reply(result);
  }

  //TODO: 메세지를 받으면 특정 룸에 리플라이 하는 방법

  // else if (cmd === 'kakaolink') {
  //   msg.replyKakaoLink({
  //     id: "00000", // 여기에 카카오 디벨로퍼 메시지 템플릿 코드 입력
  //     args: {},
  //   });
  // }
});

server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === '투두리스트') {
    let result = await notionService.getListTodoWriters();
    await msg.reply(JSON.stringify(result));
  }

  //TODO: 메세지를 받으면 특정 룸에 리플라이 하는 방법

  // else if (cmd === 'kakaolink') {
  //   msg.replyKakaoLink({
  //     id: "00000", // 여기에 카카오 디벨로퍼 메시지 템플릿 코드 입력
  //     args: {},
  //   });
  // }
});

server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === '투두벌금') {
    let result = await notionService.getTodayPenaltyList();
    if (result.length === 0) {
      await msg.reply('오늘 벌금자는 없어여');
    }
    if (result.legnth > 0) {
      await msg.reply(JSON.stringify(result));
    }
  }

  //TODO: 메세지를 받으면 특정 룸에 리플라이 하는 방법

  // else if (cmd === 'kakaolink') {
  //   msg.replyKakaoLink({
  //     id: "00000", // 여기에 카카오 디벨로퍼 메시지 템플릿 코드 입력
  //     args: {},
  //   });
  // }
});

server.start(3000);
