const notionService = require('../services/notionService');

const onNotionMessage = async (msg, cmd) => {
  const prefix = '>';

  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  cmd = args.shift()?.slice(prefix.length);

  //pingTest
  if (cmd === 'ping') {
    const timestamp = Date.now();

    try {
      await msg.reply('Pong!');
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }
  //세션테스트
  if (msg.room === 'KCbot' && cmd === 'session') {
    const timestamp = Date.now();

    try {
      await msg.reply('AlarmTest', '테스트1');
      msg.reply(notionService.notionPage, '테스트1');
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //오픈톡방 09:00 알람에 따른 응답 메세지
  //TODO: 개발 관련 기사 크롤링해서 공유하기
  if (msg.room === 'KCbot' && cmd === 'morning9:00') {
    if (new Date().getDay() != 0 || new Date().getDay() != 6) {
      const timestamp = Date.now();

      try {
        await msg.reply('굿모닝🙌 투두리스트 작성해주세요!', '취업뽀개기');
        msg.reply(notionService.notionPage, '취업뽀개기');
        msg.reply(`${Date.now() - timestamp}ms`);
      } catch (err) {
        console.error(err);
        msg.reply(`${err}`);
      }
    }
  }

  //오픈톡방 14:01 알람에 따른 응답 메세지
  if (msg.room === 'KCbot' && cmd === 'afternoon14:01') {
    if (new Date().getDay() != 0 || new Date().getDay() != 6) {
      const timestamp = Date.now();

      try {
        let result = await notionService.getTodayPenaltyList();

        if (result.length > 0) {
          msg.reply('😇삼천원!', '취업뽀개기');
          msg.reply('3333252512314 카카오뱅크', '취업뽀개기');
          msg.reply(result.toString().replaceAll(',', '\n'), '취업뽀개기');
          msg.reply(`${Date.now() - timestamp}ms`);
        }
        if (result.length === 0) {
          msg.reply('😌금일 벌금자 없음', '취업뽀개기'); // i18n
          msg.reply(`${Date.now() - timestamp}ms`);
        }
      } catch (err) {
        console.error(err);
        msg.reply(`${err}`);
      }
    }
  }

  //팀원 리스트
  if (cmd === '팀원') {
    const timestamp = Date.now();

    try {
      let result = await notionService.getTeamMembers();
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
    try {
      let result = await notionService.getListTodoWriters();

      switch (result.length) {
        case 0:
          msg.reply('아직 아무도 안씀!!😤');
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

    try {
      let result = await notionService.getTodayPenaltyList();

      switch (result.length) {
        case 0:
          msg.reply('😌금일 벌금자 없음');
          msg.reply(`${Date.now() - timestamp}ms`);
          break;

        default:
          if (
            currentTime.getHours() < 14 ||
            (currentTime.getHours() == 14 && currentTime.getMinutes() < 1)
          ) {
            msg.reply('아직 14:00 안됨 얼렁 쓰세여🤟');
            msg.reply(result.toString().replaceAll(',', '\n'));
            msg.reply(`${Date.now() - timestamp}ms`);
          }

          if (
            currentTime.getHours() > 14 ||
            (currentTime.getHours() == 14 && currentTime.getMinutes() >= 1)
          ) {
            msg.reply('입금하셨나요😝?');
            msg.reply('3333252512314 카카오뱅크');
            msg.reply(result.toString().replaceAll(',', '\n'));
            msg.reply(`${Date.now() - timestamp}ms`);
          }
      }
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }
};

module.exports = {
  onNotionMessage,
};
