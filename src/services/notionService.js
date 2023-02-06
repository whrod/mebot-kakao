require('dotenv').config();

const { Client } = require('@notionhq/client');

const {
  NOTION_TOKEN: notionToken,
  NOTION_PAGE_URL: notionPage,
  NOTION_DOMAIN: notionDomain,
  NOTION_TODO_DATABASE_ID: todoDatabaseId,
  NOTION_BLOG_DATABASE_ID: blogDatabaseId,
  NOTION_INTERVIEW_DATABASE_ID: interviewDatabaseId,
  NOTION_MEMBER_SNS_DATABASE_ID: memberSnsDatabaseId,
  NOTION_PORTFOLIO_DATABASE_ID: portfolioDatabaseId,
  NOTION_REF_SITES_DATABASE_ID: refSitesDatabaseId,
  NOTION_PROJECT_IDEAS_DATABASE_ID: projectsDatabaseId,
  NOTION_MEETING_SCHEDULE_DATABASE_ID: meetingScheduleDatabaseId,
} = process.env;

const notion = new Client({
  auth: notionToken,
});

const { getKoreanDate } = require('../util/dateFormat');

const getDbObjects = async (databaseId) => {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });
  return response;
};

const getPayload = (databaseId) => ({
  path: `databases/${databaseId}/query`,
  method: 'POST',
});

const notionPageUrl = notionPage;
const interviewPageUrl = notionDomain + interviewDatabaseId;

//팀멤버
const getTeamMembers = async () => {
  const todoDBObjects = await getDbObjects(todoDatabaseId);

  const teamMembers = todoDBObjects.properties['팀원'].multi_select.options.map(
    (list) => list.name
  );
  return teamMembers;
};

//금일 멤버들의 투두리스트의 리스트
const getListTodoWriters = async () => {
  const todoPayload = getPayload(todoDatabaseId);

  const { results } = await notion.request(todoPayload);

  const today = getKoreanDate();

  const listOfTodayTodoWriters = results
    .filter((data) => today === data.properties['날짜'].date.start)
    .map((data) => {
      const name = data.properties['이름'].title[0].text.content;
      const link = notionDomain + data.url.slice(22);
      const created_time = new Date(Date.parse(data.created_time));
      const created_hour = created_time.getHours();
      const created_day = () => {
        if (new Date().getDate() === created_time.getDate()) {
          return;
        }
        if (new Date().getDate != created_time.getDate()) {
          return created_time.getDate() + '일';
        }
      };
      const timeString = created_day()
        ? `${created_day()},${created_hour}시`
        : `${created_hour}시`;

      return `${name}(${timeString}): ${link}`;
    });

  return listOfTodayTodoWriters;
};

//제 시간(14:01) 안에 쓴 사람 목록
const getWritersInTime = async () => {
  const todoPayload = getPayload(todoDatabaseId);

  const { results } = await notion.request(todoPayload);
  const today = getKoreanDate();

  const writersInTime = results
    .filter((data) => {
      return today === data.properties['날짜'].date.start;
    }) // 금일 날짜 조건
    .filter((data) => {
      const createdTime = new Date(data.created_time);
      const deadline = new Date(today + 'T14:01:00');
      return createdTime < deadline;
    }) //14:01까지 쓴사람
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

// // ** Notion API 기능 출력 **
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
  notionPageUrl,
  interviewPageUrl,
};
