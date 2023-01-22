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

  let teamMembers = []; //TODO: 고차함수 활용
  for (const list of response.properties['태그'].multi_select.options) {
    teamMembers.push(list.name);
  }
  return teamMembers;
};

//금일 멤버들의 투두리스트의 리스트
//TODO:투두리스트 작성시간이 오늘이 아닐때 처리
const getListTodoWriters = async () => {
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST',
  };

  const { results } = await notion.request(payload);

  const today = getTodayInNotionFormat();

  const listOfTodayTodoWriters = results
    .filter((data) => today === data.properties['날짜'].date.start)
    .map((data) => {
      const name = data.properties['이름'].title[0].text.content;
      const link = data.url;
      const created_time = new Date(Date.parse(data.created_time)).getHours();
      return `${name}(${created_time}시): ${link}`;
    });

  return listOfTodayTodoWriters;
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
      data.created_time = new Date(Date.parse(data.created_time));
      return data;
    }) //날짜 type string => date로(getHours()하기 위해, getHours()는 한국시간으로 안바꿔야함)
    .filter(
      (data) =>
        data.created_time.getHours() < 14 ||
        (data.created_time.getHours() == 14 && new Date().getMinutes() < 1)
    ) //14:01까지 쓴사람
    .map((page) => page.properties['이름'].title[0].text.content); //이름만 다시 뽑은 배열

  return writersInTime;
};

//제 시간(14:01)에 쓰지 않은 사람
const getTodayPenaltyList = async (writersInTime, teamMembers) => {
  writersInTime = await getWritersInTime();

  teamMembers = await getTeamMembers();

  return teamMembers
    .filter((name) => !writersInTime.includes(name))
    .map((name) => '@' + name);
};

// // ** Notion API 기능 출력 Test **
// (async () => {
//   const todoWriters = await getListTodoWriters();
//   console.log('►TodoLists: ', todoWriters);
//   console.log('-------------------------\n');

//   const writersInTime = await getWritersInTime();
//   console.log('►InTime: ', writersInTime);
//   console.log('-------------------------\n');

//   const teamMembers = await getTeamMembers();
//   console.log('►TeamMembers: ', teamMembers);
//   console.log('-------------------------\n');

//   const todayPenaltyList = await getTodayPenaltyList(
//     writersInTime,
//     teamMembers
//   );
//   console.log('►PenaltyLIst: ', todayPenaltyList);
//   console.log('-------------------------');
// })();

module.exports = {
  getTeamMembers,
  getListTodoWriters,
  getTodayPenaltyList,
  getWritersInTime,
};
