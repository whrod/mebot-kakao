/* TODO:
- 알람 기능
- 중복 코드 간소화 (mapping)
- 상수 enum화
- 에러핸들링(배열.length === 0일때, promise)
- 카카오링크
- @인물태그
- 주석삭제
*/

import { Server, Message } from '@remote-kakao/core';
import LoggerPlugin from './plugins/logger';

//FIXME: 카카오링크 사용시
// import KakaoLinkPlugin from '@remote-kakao/kakaolink-plugin';
// import config from '../config.json'

const notionService = require('./services/notionService');

const prefix = '>';
const server = new Server();
server.usePlugin(LoggerPlugin);

//FIXME: 카카오링크 사용시
// server.usePlugin(KakaoLinkPlugin, config);

server.on('message', async (msg) => {
  console.log(msg);
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === 'ping') {
    const timestamp = Date.now();

    await msg.reply('Pong!');
    msg.reply(`${Date.now() - timestamp}ms`);
  }
  //A방의 커맨드를 B방에서 응답하기
  if (msg.room === 'test' && cmd === 'test') {
    const timestamp = Date.now();
    msg.reply(`${Date.now() - timestamp}ms`, 'test2');
  }

  //팀원 리스트
  if (cmd === '팀원') {
    const timestamp = Date.now();

    let result = await notionService.getTeamMembers();
    try {
      msg.reply(result.toString().replaceAll(',', '\n'));
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.log(err);
    }
  }

  //팀원들 투두리스트(이름(작성시간):url)
  //TODO: length===0일때 처리
  if (cmd === '투두리스트') {
    const timestamp = Date.now();

    let result = await notionService.getListTodoWriters();

    try {
      msg.reply(result.toString().replaceAll(',', '\n'));
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.log(err);
    }
  }

  //제 시간(14:00)에 투두 작성하지 않은 사람 리스트
  if (cmd === '투두벌금') {
    const timestamp = Date.now();

    const currentTime = new Date();

    let result = await notionService.getTodayPenaltyList();

    try {
      if (
        (currentTime.getHours() < 14 ||
          (currentTime.getHours() == 14 && currentTime.getMinutes() < 1)) &&
        result.length > 0
      ) {
        msg.reply('아직 14:00 안됨 얼렁 쓰세여');
        msg.reply(result.toString().replaceAll(',', '\n'));
        msg.reply(`${Date.now() - timestamp}ms`);
      }
      if (result.length === 0) {
        msg.reply('금일 벌금자 없음'); // i18n
        msg.reply(`${Date.now() - timestamp}ms`);
      }
      if (
        (currentTime.getHours() > 14 ||
          (currentTime.getHours() == 14 && currentTime.getMinutes() >= 1)) &&
        result.length > 0
      ) {
        msg.reply('삼천원 입금 ㄱㄱ');
        msg.reply(result.toString().replaceAll(',', '\n'));
        msg.reply(`${Date.now() - timestamp}ms`);
      }
    } catch (err) {
      console.log(err);
    }
  }
});

// FIXME: 카카오링크 사용시
// else if (cmd === 'kakaolink') {
//   msg.replyKakaoLink({
//     id: "00000", // 여기에 카카오 디벨로퍼 메시지 템플릿 코드 입력
//     args: {},
//   });
// }
// });

server.start(3000);
