const notionService = require('../services/notionService');
const {
  notionCommands,
  sendMsgRooms,
  receiveMsgRooms,
  notionReplyMessages,
  limitTimes,
  manual,
  commonCommands,
  commonReplyMessages,
} = require('../constants/constants');

const onNotionMessage = async (msg, cmd) => {
  const prefix = '>';

  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  cmd = args.shift()?.slice(prefix.length);

  //pingTest
  //>ping
  if (cmd === commonCommands.pingTest) {
    const timestamp = Date.now();

    try {
      await msg.reply(commonReplyMessages.msgPong);
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //manual
  //>manual
  if (commonCommands.manual.includes(cmd)) {
    const timestamp = Date.now();

    try {
      await msg.reply(manual.replaceAll(',', ' '));
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
    cmd === commonCommands.sessionTest
  ) {
    const timestamp = Date.now();

    try {
      await msg.reply(
        commonReplyMessages.msgAlarmTest,
        receiveMsgRooms.testRecRoom
      );
      msg.reply(notionService.notionPageUrl, receiveMsgRooms.testRecRoom);
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
          notionReplyMessages.msgAlarmTodoMorning,
          receiveMsgRooms.studyRecRoom
        );
        msg.reply(notionService.notionPageUrl, receiveMsgRooms.studyRecRoom);
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
        let result = await notionService.getTodoPenaltyList();

        if (result.length > 0) {
          msg.reply(
            notionReplyMessages.msgAlarmTodoPenalty,
            receiveMsgRooms.studyRecRoom
          );
          msg.reply(
            notionReplyMessages.msgPenaltyAccount,
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
            notionReplyMessages.msgNoTodoPenalty,
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
      let result = await notionService.getTodayTodoLists();

      switch (result.length) {
        case 0:
          msg.reply(notionReplyMessages.msgNoTodoList);
          msg.reply(`${Date.now() - timestamp}ms`);
          break;

        default:
          msg.reply(notionReplyMessages.msgCallTodoList);
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
      let result = await notionService.getTodoPenaltyList();

      switch (result.length) {
        case 0:
          msg.reply(notionReplyMessages.msgNoTodoPenalty);
          msg.reply(`${Date.now() - timestamp}ms`);
          break;

        default:
          if (
            currentTime.getHours() < limitTimes.todoLimitHour ||
            (currentTime.getHours() == limitTimes.todoLimitHour &&
              currentTime.getMinutes() < limitTimes.todoLimitMinute)
          ) {
            msg.reply(notionReplyMessages.msgNoLimitTimeTodo);
            msg.reply(result.toString().replaceAll(',', '\n'));
            msg.reply(`${Date.now() - timestamp}ms`);
          }

          if (
            currentTime.getHours() > limitTimes.todoLimitHour ||
            (currentTime.getHours() == limitTimes.todoLimitHour &&
              currentTime.getMinutes() >= limitTimes.todoLimitMinute)
          ) {
            msg.reply(notionReplyMessages.msgLimitTimeOverTodo);
            msg.reply(notionReplyMessages.msgPenaltyAccount);
            msg.reply(result.toString().replaceAll(',', '\n'));
            msg.reply(`${Date.now() - timestamp}ms`);
          }
      }
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //면접 질문 리스트 url
  if (notionCommands.interviewList.includes(cmd)) {
    const timestamp = Date.now();

    try {
      await msg.reply(notionReplyMessages.msgInterviewList);
      msg.reply(notionService.interviewPageUrl);
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //팀원들 블로그리스트(이름(제목):url)
  //>작성 블로그 리스트
  if (notionCommands.blogList.includes(cmd)) {
    const timestamp = Date.now();
    try {
      let result = await notionService.getThisWeekBlogList();

      switch (result.length) {
        case 0:
          msg.reply(notionReplyMessages.msgNoThisWeekBlog);
          msg.reply(`${Date.now() - timestamp}ms`);
          break;

        default:
          msg.reply(notionReplyMessages.msgCallBlogList);
          msg.reply(result.toString().replaceAll(',', '\n'));
          msg.reply(`${Date.now() - timestamp}ms`);
      }
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //팀원들 개인사이트(이름 / url)
  //>이름
  //TODO: 팀원 이름 constants가 아닌 notion db에서 cmd 비교할 수 있게
  if (notionCommands.snsList.includes(cmd)) {
    const timestamp = Date.now();
    try {
      let result = await notionService.getMemberSns(cmd);
      msg.reply(cmd + notionReplyMessages.msgCallSnsList);
      msg.reply(result.toString().replaceAll(',', '\n'));
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }
};

module.exports = {
  onNotionMessage,
};
