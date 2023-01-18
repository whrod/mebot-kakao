require('dotenv').config();

const { Client } = require('@notionhq/client');
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const database_id = process.env.NOTION_DATABASE_ID;
const { getTodayInNotionFormat } = require('../utils/dateFormat');

//팀멤버
const getTeamMembers = async () => {
  const response = await notion.databases.retrieve({
    database_id: database_id,
  });

  teamMembers = [];
  for (const element of response.properties['태그'].multi_select.options) {
    teamMembers.push(element.name);
  }
  return teamMembers;
};

//금일 멤버들의 투두리스트의 리스트
const getListTodoWriters = async () => {
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST',
  };

  const { results } = await notion.request(payload);

  const today = getTodayInNotionFormat();

  const getListOfTodayTodoWriters = results
    .filter((page) => today === page.properties['날짜'].date.start)
    .map((page) => {
      const name = page.properties['이름'].title[0].text.content;
      const link = page.url;
      const listTodayWriters = {};
      listTodayWriters[name] = link;

      return listTodayWriters;
    });

  return getListOfTodayTodoWriters;
};

//제 시간(14:00) 안에 쓴 사람 목록
const getWritersInTime = async () => {
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST',
  };

  const { results } = await notion.request(payload);

  const today = getTodayInNotionFormat();

  const writersInTime = results
    .filter((data) => today === data.properties['날짜'].date.start) // 금일 날짜 조건
    .map((data) => {
      const currentKoreaTime = new Date(
        Date.parse(data.created_time) + 3600000 * 9
      );

      data.created_time = currentKoreaTime;
      return data;
    })
    .filter(
      (data) =>
        data.created_time.getHours() <= 14 &&
        data.created_time.getMinutes() <= 01
    ) //한국시간 변경 후 14:01까지 쓴사람
    .map((page) => page.properties['이름'].title[0].text.content); //이름만 다시 뽑은 배열
  // console.log(todayWritersInTime)

  return writersInTime;
};

// const getTodayPenaltyList = async (todoWriters, teamMembers) => {
//   todoWriters = await getListTodoWriters();

//   teamMembers = await getTeamMembers();

//   const getNamesFromTodoWriters = await todoWriters
//     .map((name) => Object.keys(name))
//     .flat();
//   return teamMembers
//     .filter((name) => !getNamesFromTodoWriters.includes(name))
//     .map((name) => '@' + name);
// };

//제 시간(14:01)에 쓰지 않은 사람
const getTodayPenaltyList = async (writersInTime, teamMembers) => {
  writersInTime = await getWritersInTime();

  teamMembers = await getTeamMembers();

  return teamMembers
    .filter((name) => !writersInTime.includes(name))
    .map((name) => '@' + name);
};

//** Notion API function output test **
(async () => {
  const todoWriters = await getListTodoWriters();
  console.log(todoWriters, '--ToDoWriters--');

  const writersInTime = await getWritersInTime();
  console.log(writersInTime, '--InTime--');

  const teamMembers = await getTeamMembers();
  console.log(teamMembers, '--TeamMembers--');

  const todayPenaltyList = await getTodayPenaltyList(todoWriters, teamMembers);
  console.log(todayPenaltyList, '--PenaltyList--');
})();

module.exports = {
  getTeamMembers,
  getListTodoWriters,
  getTodayPenaltyList,
  getWritersInTime,
};
