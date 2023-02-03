const notionService = require('../services/notionService');
const {
  notionCommands,
  sendMsgRooms,
  receiveMsgRooms,
  replyMessages,
  limitTimes,
  notionManual,
} = require('../constants/notionConstants');

const onNotionMessage = async (msg, cmd) => {
  const prefix = '>';

  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  cmd = args.shift()?.slice(prefix.length);

  //pingTest
  //>ping
  if (cmd === notionCommands.pingTest) {
    const timestamp = Date.now();

    try {
      await msg.reply(replyMessages.msgPong);
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //manual
  //>manual
  if (notionCommands.manual.includes(cmd)) {
    const timestamp = Date.now();

    try {
      await msg.reply(notionManual);
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //세션테스트
  //>session
  if (
    msg.room === sendMsgRooms.testSendRoom &&
    cmd === notionCommands.sessionTest
  ) {
    const timestamp = Date.now();

    try {
      await msg.reply(replyMessages.msgAlarmTest, receiveMsgRooms.testRecRoom);
      msg.reply(notionService.notionPage, receiveMsgRooms.testRecRoom);
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //오픈톡방 09:00 알람에 따른 응답 메세지
  //>morning9:00
  //TODO: 개발 관련 기사 크롤링해서 공유하기
  if (
    msg.room === sendMsgRooms.alarmSendRoom &&
    cmd === notionCommands.cmdAlarmTodoMorning
  ) {
    if (new Date().getDay() != 0 && new Date().getDay() != 6) {
      const timestamp = Date.now();

      try {
        await msg.reply(
          replyMessages.msgAlarmTodoMorning,
          receiveMsgRooms.studyRecRoom
        );
        msg.reply(notionService.notionPage, receiveMsgRooms.studyRecRoom);
        msg.reply(`${Date.now() - timestamp}ms`);
      } catch (err) {
        console.error(err);
        msg.reply(`${err}`);
      }
    }
  }

  //오픈톡방 14:01 알람에 따른 응답 메세지
  //>afternoon14:01
  if (
    msg.room === sendMsgRooms.alarmSendRoom &&
    cmd === notionCommands.cmdAlarmTodoPenalty
  ) {
    if (new Date().getDay() != 0 && new Date().getDay() != 6) {
      const timestamp = Date.now();

      try {
        let result = await notionService.getTodayPenaltyList();

        if (result.length > 0) {
          msg.reply(
            replyMessages.msgAlarmTodoPenalty,
            receiveMsgRooms.studyRecRoom
          );
          msg.reply(
            replyMessages.msgPenaltyAccount,
            receiveMsgRooms.studyRecRoom
          );
          msg.reply(
            result.toString().replaceAll(',', '\n'),
            receiveMsgRooms.studyRecRoom
          );
          msg.reply(`${Date.now() - timestamp}ms`);
        }
        if (result.length === 0) {
          msg.reply(
            replyMessages.msgNoTodoPenalty,
            receiveMsgRooms.studyRecRoom
          );
          msg.reply(`${Date.now() - timestamp}ms`);
        }
      } catch (err) {
        console.error(err);
        msg.reply(`${err}`);
      }
    }
  }

  //팀원 리스트
  //>팀원
  if (notionCommands.teamMember.includes(cmd)) {
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
  //>투두리스트
  if (notionCommands.todoList.includes(cmd)) {
    const timestamp = Date.now();
    try {
      let result = await notionService.getListTodoWriters();

      switch (result.length) {
        case 0:
          msg.reply(replyMessages.msgNoTodoList);
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

  //제 시간(14:01)까지 투두 작성하지 않은 사람 리스트
  //>투두벌금
  if (notionCommands.todoPenalty.includes(cmd)) {
    const timestamp = Date.now();
    const currentTime = new Date();

    try {
      let result = await notionService.getTodayPenaltyList();

      switch (result.length) {
        case 0:
          msg.reply(replyMessages.msgNoTodoPenalty);
          msg.reply(`${Date.now() - timestamp}ms`);
          break;

        default:
          if (
            currentTime.getHours() < limitTimes.todoLimitHour ||
            (currentTime.getHours() == limitTimes.todoLimitHour &&
              currentTime.getMinutes() < limitTimes.todoLimitMinute)
          ) {
            msg.reply(replyMessages.msgNoLimitTimeTodo);
            msg.reply(result.toString().replaceAll(',', '\n'));
            msg.reply(`${Date.now() - timestamp}ms`);
          }

          if (
            currentTime.getHours() > limitTimes.todoLimitHour ||
            (currentTime.getHours() == limitTimes.todoLimitHour &&
              currentTime.getMinutes() >= limitTimes.todoLimitMinute)
          ) {
            msg.reply(replyMessages.msgLimitTimeOverTodo);
            msg.reply(replyMessages.msgPenaltyAccount);
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
