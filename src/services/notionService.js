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

const { getKoreanDate } = require('../util/dateFormat');

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

// // 금일 투두리스트 수정 버젼
// const getTodayTodoLists = async () => {
//   // const todoPayload = getPayload(todoDatabaseId);
//   const today = getKoreanDate();

//   const getPayload = (databaseId) => ({
//     path: `databases/${databaseId}/query`,
//     method: 'POST',
//     query: {
//       filter: {
//         and: [
//           {
//             property: '날짜',
//             date: {
//               past_week: {},
//             },
//           },
//         ],
//       },
//     },
//   });

// const todoPayload = getPayload(todoDatabaseId);
// // console.log(todoPayload);

// const { results } = await notion.request(todoPayload);
// // console.log(results);

// const todayTodoLists = results.map((data) => {
//   const name = data.properties['이름'].title[0].text.content;
//   const link = notionDomain + data.url.slice(22);
//   const created_time = new Date(Date.parse(data.created_time));
//   const created_hour = created_time.getHours();
//   const created_day = () => {
//     if (new Date().getDate() === created_time.getDate()) {
//       return;
//     }
//     if (new Date().getDate != created_time.getDate()) {
//       return created_time.getDate() + '일';
//     }
//   };
//   const timeString = created_day()
//     ? `${created_day()},${created_hour}시`
//     : `${created_hour}시`;

//   return `${name}(${timeString}): ${link}`;
// });

// return todayTodoLists;
// };

// 금일 멤버들의 투두리스트의 리스트
const getTodayTodoLists = async () => {
  const todoPayload = getPayload(todoDatabaseId);

  const { results } = await notion.request(todoPayload);

  const today = getKoreanDate();

  const todayTodoLists = results
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

  return todayTodoLists;
};

//제 시간(14:01) 안에 쓴 사람 목록
const getTodoWritersInTime = async () => {
  const todoPayload = getPayload(todoDatabaseId);

  const { results } = await notion.request(todoPayload);
  const today = getKoreanDate();

  const todoWritersInTime = results
    .filter((data) => {
      return today === data.properties['날짜'].date.start;
    }) // 금일 날짜 조건
    .filter((data) => {
      const createdTime = new Date(data.created_time);
      const deadline = new Date(today + 'T14:01:00');
      return createdTime < deadline;
    }) //14:01까지 쓴사람
    .map((page) => page.properties['이름'].title[0].text.content); //이름만 다시 뽑은 배열

  return todoWritersInTime;
};

//제 시간(14:01)에 쓰지 않은 사람
const getTodoPenaltyList = async (todoWritersInTime, teamMembers) => {
  todoWritersInTime = await getTodoWritersInTime();
  teamMembers = await getTeamMembers();

  const todoPenaltyList = teamMembers
    .filter((name) => !todoWritersInTime.includes(name))
    .map((name) => '@' + name);

  return todoPenaltyList;
};

// TODO: 작성 블로그 관련 기능
// 1. 작성 블로그 리스트 :
//    - 투두리스트처럼 목록 호출
//    - 금주에 아직 안쓴사람 리스트를 같이 호출 / 모두 다 썼다면 출력 X
// 2. 블로그 벌금 리스트 :
//    - 호출하면 지난주 벌금 리스트가 나오게
// 3. 블로그 벌금 알람 :
//    - content는 시작 알람, 벌금 알람 내용 포함되게
//    - 벌금 알람 : 일요일 00시 / 일요일 00시까지 안쓴 사람 리스트
//    - 시작 알람 : 단순 안내 내용 strings
// *  DB의 필터가 객체나 코드로 뽑아서 쓸 수 있는지 확인 필요
const notionDbQuery = async (databaseId, filter) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filter,
  });
  return response;
};

const filter = {
  property: '날짜',
  date: {
    this_week: {},
  },
};

const getThisWeekBlogList = async () => {
  const response = await notionDbQuery(blogDatabaseId, filter);

  const thisWeekBlogList = response.results.map((data) => {
    const name = data.properties['팀원'].multi_select[0].name;
    const title = data.properties['제목'].title[0].plain_text;
    const titleString = () => {
      if (title.length > 10) {
        return title.slice(0, 8) + '...';
      }
      return title;
    };
    const blogUrl = data.properties.URL.url;
    return `${name}(${titleString()}): ${blogUrl}`;
  });

  return thisWeekBlogList;
};

const getBlogPenaltyList = async (teamMembers) => {
  teamMembers = await getTeamMembers();
  const response = await notionDbQuery(blogDatabaseId, filter);
  const blogWriterListInTime = response.results.map((data) => {
    return data.properties['팀원'].multi_select[0].name;
  });

  const blogPenaltyList = teamMembers
    .filter((name) => !blogWriterListInTime.includes(name))
    .map((name) => '@' + name);

  return blogPenaltyList;
};

// // ** Notion API 기능 출력 **
// (async () => {
// const todayTodoLists = await getTodayTodoLists();
// console.log('►TodoLists: ', todayTodoLists);
// console.log('-------------------------\n');
// const todoWritersInTime = await getTodoWritersInTime();
// console.log('►InTime: ', todoWritersInTime);
// console.log('-------------------------\n');
// const teamMembers = await getTeamMembers();
// console.log('►TeamMembers: ', teamMembers);
// console.log('-------------------------\n');
// const todoPenaltyList = await getTodoPenaltyList(
//   todoWritersInTime,
//   teamMembers
// );
// console.log('►PenaltyLIst: ', todoPenaltyList);
// console.log('-------------------------');

//   const blogList = await getThisWeekBlogList();
//   console.log('►BlogList: ', blogList);
//   console.log('-------------------------\n');

//   const blogPenaltyList = await getBlogPenaltyList();
//   console.log('►BlogPenaltyList: ', blogPenaltyList);
//   console.log('-------------------------\n');
// })();

module.exports = {
  getTeamMembers,
  getTodayTodoLists,
  getTodoPenaltyList,
  getTodoWritersInTime,
  getThisWeekBlogList,
  getBlogPenaltyList,
  notionPageUrl,
  interviewPageUrl,
};
