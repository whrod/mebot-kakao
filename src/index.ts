import { Server, Message } from '@remote-kakao/core';
// import KakaoLinkPlugin from '@remote-kakao/kakaolink-plugin';
import LoggerPlugin from './plugins/logger';

const notionService = require('./services/notionService');

const prefix = '>';
const server = new Server();

server.usePlugin(LoggerPlugin);
// server.usePlugin(KakaoLinkPlugin, config);

/* TODO:
- 알림 기능
- 중복 코드 간소화 (클래스 활용)
- cmd enum화
- 카카오링크
- 주석삭제
*/

//pingTest
server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === 'ping') {
    const timestamp = Date.now();

    await msg.reply('Pong!');
    msg.reply(`${Date.now() - timestamp}ms`);
  }
});

//팀원
server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === '팀원') {
    const timestamp = Date.now();

    let result = await notionService.getTeamMembers();

    await msg.reply(result);
    msg.reply(`${Date.now() - timestamp}ms`);
  }
});
//투두리스트;
server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === '투두리스트') {
    const timestamp = Date.now();

    let result = await notionService.getListTodoWriters();

    await msg.reply(JSON.stringify(result));
    msg.reply(`${Date.now() - timestamp}ms`);
  }
});

//투두벌금
server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === '투두벌금') {
    const timestamp = Date.now();

    const currentTime = new Date();
    // const currentKoreaTime =
    //   currentTime.getHours() + (-1 * currentTime.getTimezoneOffset()) / 60;

    let result = await notionService.getTodayPenaltyList();

    // console.log(timestamp, '--timestamp--');
    // console.log(currentTime, '--newDate--');
    // console.log(currentTime.getTimezoneOffset());
    // console.log(currentTime.getHours());

    if (currentTime.getHours() < 14) {
      await msg.reply('아직 14:00 안됨 얼렁 쓰세여');
      msg.reply(`${Date.now() - timestamp}ms`);
    }
    if (result.length > 0) {
      await msg.reply(JSON.stringify(result));
      msg.reply(`${Date.now() - timestamp}ms`);
    }
    if (result.length === 0) {
      await msg.reply('금일 벌금자 없음');
      msg.reply(`${Date.now() - timestamp}ms`);
    }
  }
});

// else if (cmd === 'kakaolink') {
//   msg.replyKakaoLink({
//     id: "00000", // 여기에 카카오 디벨로퍼 메시지 템플릿 코드 입력
//     args: {},
//   });
// }
// });

server.start(3000);
