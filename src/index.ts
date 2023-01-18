import { Server, Message } from '@remote-kakao/core';
import { nextTick } from 'process';
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
- @인물태그
*/

server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === 'ping') {
    const timestamp = Date.now();

    await msg.reply('Pong!');
    msg.reply(`${Date.now() - timestamp}ms`);
  }

  //팀원 리스트
  if (cmd === '팀원') {
    const timestamp = Date.now();

    let result = await notionService.getTeamMembers();
    try {
      msg.reply(result);
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      throw err;
    }
  }

  //팀원들 투두리스트(이름:url)
  //TODO: JSON 형식 어떻게 보낼지 고민
  if (cmd === '투두리스트') {
    const timestamp = Date.now();

    let result = await notionService.getListTodoWriters();
    try {
      msg.reply(JSON.stringify(result));
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      throw err;
    }
  }

  //제 시간(14:00)에 투두 작성하지 않은 사람 리스트
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
    try {
      if (currentTime.getHours() <= 14 && result.length > 0) {
        msg.reply('아직 14:00 안됨 얼렁 쓰세여');
        msg.reply(result);
        msg.reply(`${Date.now() - timestamp}ms`);
      }
      if (result.length === 0) {
        msg.reply('금일 벌금자 없음');
        msg.reply(`${Date.now() - timestamp}ms`);
      }
      if (currentTime.getHours() > 14 && result.length > 0) {
        msg.reply('삼천원 입금 ㄱㄱ');
        msg.reply(result);
        msg.reply(`${Date.now() - timestamp}ms`);
      }
    } catch (err) {
      throw err;
    }
  }
});

// //팀원
// server.on('message', async (msg) => {
//   if (!msg.content.startsWith(prefix)) return;

//   const args = msg.content.split(' ');
//   const cmd = args.shift()?.slice(prefix.length);

//   if (cmd === '팀원') {
//     const timestamp = Date.now();

//     let result = await notionService.getTeamMembers();
//     try {
//       msg.reply(result);
//       msg.reply(`${Date.now() - timestamp}ms`);
//     } catch (err) {
//       throw err;
//     }
//   }
// });
// //투두리스트;
// //TODO: JSON 형식 재구성
// server.on('message', async (msg) => {
//   if (!msg.content.startsWith(prefix)) return;

//   const args = msg.content.split(' ');
//   const cmd = args.shift()?.slice(prefix.length);

//   if (cmd === '투두리스트') {
//     const timestamp = Date.now();

//     let result = await notionService.getListTodoWriters();
//     try {
//       msg.reply(JSON.stringify(result));
//       msg.reply(`${Date.now() - timestamp}ms`);
//     } catch (err) {
//       throw err;
//     }
//   }
// });

// //투두벌금
// server.on('message', async (msg) => {
//   if (!msg.content.startsWith(prefix)) return;

//   const args = msg.content.split(' ');
//   const cmd = args.shift()?.slice(prefix.length);

//   if (cmd === '투두벌금') {
//     const timestamp = Date.now();

//     const currentTime = new Date();
//     // const currentKoreaTime =
//     //   currentTime.getHours() + (-1 * currentTime.getTimezoneOffset()) / 60;

//     let result = await notionService.getTodayPenaltyList();

//     // console.log(timestamp, '--timestamp--');
//     // console.log(currentTime, '--newDate--');
//     // console.log(currentTime.getTimezoneOffset());
//     // console.log(currentTime.getHours());
//     try {
//       if (currentTime.getHours() <= 14 && result.length > 0) {
//         msg.reply('아직 14:00 안됨 얼렁 쓰세여');
//         msg.reply(result);
//         msg.reply(`${Date.now() - timestamp}ms`);
//       }
//       if (result.length === 0) {
//         msg.reply('금일 벌금자 없음');
//         msg.reply(`${Date.now() - timestamp}ms`);
//       }
//       if (currentTime.getHours() > 14 && result.length > 0) {
//         msg.reply('삼천원 입금 ㄱㄱ');
//         msg.reply(result);
//         msg.reply(`${Date.now() - timestamp}ms`);
//       }
//     } catch (err) {
//       throw err;
//     }
//   }
// });

// else if (cmd === 'kakaolink') {
//   msg.replyKakaoLink({
//     id: "00000", // 여기에 카카오 디벨로퍼 메시지 템플릿 코드 입력
//     args: {},
//   });
// }
// });

server.start(3000);
