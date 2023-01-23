/* TODO:
- 알람 기능 (socket 활용 방안 고안)
- 중복 코드 간소화 (mapping)
- 상수 관리
- 에러핸들링(promise)
- 에러핸들링 커맨드 입력 가능 시간 관리
- github action ci/cd 구축
*/

import { Server } from '@remote-kakao/core';
import LoggerPlugin from './plugins/logger';
import config from '../config.json';

//FIXME: 카카오링크 사용시
// import KakaoLinkPlugin from '@remote-kakao/kakaolink-plugin';

const notionService = require('./services/notionService');

const prefix = '>';
const server = new Server();
server.usePlugin(LoggerPlugin);

//FIXME: 카카오링크 사용시
// server.usePlugin(KakaoLinkPlugin, config);

server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  //pingTest
  if (cmd === 'ping') {
    const timestamp = Date.now();
    console.log(msg);

    await msg.reply('Pong!').catch(() => {
      console.log(Error);
      msg.reply(Error.name);
    });
    try {
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //오픈톡방 09:00 알람에 따른 응답 메세지
  //TODO: 개발 관련 기사 크롤링해서 공유하기
  if (msg.room === 'KCbot' && cmd === 'morning9:00') {
    const timestamp = Date.now();
    try {
      await msg.reply('굿모닝:) 투두리스트 작성해주세요!', '테스트3');

      msg.reply(config.notionPage, '테스트3');
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //오픈톡방 14:01 알람에 따른 응답 메세지
  if (msg.room === 'KCbot' && cmd === 'afternoon14:01') {
    const timestamp = Date.now();

    let result = await notionService.getTodayPenaltyList().catch(() => {
      console.log(Error);
      msg.reply(Error.name);
    });

    try {
      if (result.length > 0) {
        msg.reply('삼천원 입금 ㄱㄱ', '취업뽀개기');
        msg.reply(result.toString().replaceAll(',', '\n'), '취업뽀개기');
        msg.reply(`${Date.now() - timestamp}ms`);
      }
      if (result.length === 0) {
        msg.reply('금일 벌금자 없음', '취업뽀개기'); // i18n
        msg.reply(`${Date.now() - timestamp}ms`);
      }
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //팀원 리스트
  if (cmd === '팀원') {
    const timestamp = Date.now();

    let result = await notionService.getTeamMembers().catch(() => {
      console.log(Error);
      msg.reply(Error.name);
    });

    try {
      msg.reply(result.toString().replaceAll(',', '\n'));
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //팀원들 투두리스트(이름(작성시간):url)
  if (cmd === '투두리스트') {
    const timestamp = Date.now();

    let result = await notionService.getListTodoWriters().catch(() => {
      console.log(Error);
      msg.reply(Error.name);
    });

    try {
      switch (result.length) {
        case 0:
          msg.reply('아직 아무도 안씀!!');
          msg.reply(`${Date.now() - timestamp}ms`);
          break;

        default:
          msg.reply(result.toString().replaceAll(',', '\n'));
          msg.reply(`${Date.now() - timestamp}ms`);
      }
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //제 시간(14:00)에 투두 작성하지 않은 사람 리스트
  if (cmd === '투두벌금') {
    const timestamp = Date.now();
    const currentTime = new Date();

    let result = await notionService.getTodayPenaltyList().catch(() => {
      console.log(Error);
      msg.reply(Error.name);
    });

    try {
      switch (result.length) {
        case 0:
          msg.reply('금일 벌금자 없음');
          msg.reply(`${Date.now() - timestamp}ms`);
          console.log('case0');
          break;

        default:
          if (
            currentTime.getHours() < 14 ||
            (currentTime.getHours() == 14 && currentTime.getMinutes() < 1)
          ) {
            msg.reply('아직 14:00 안됨 얼렁 쓰세여');
            msg.reply(result.toString().replaceAll(',', '\n'));
            msg.reply(`${Date.now() - timestamp}ms`);
          }

          if (
            currentTime.getHours() > 14 ||
            (currentTime.getHours() == 14 && currentTime.getMinutes() >= 1)
          ) {
            msg.reply('삼천원 입금 ㄱㄱ');
            msg.reply(result.toString().replaceAll(',', '\n'));
            msg.reply(`${Date.now() - timestamp}ms`);
          }
      }
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
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
