require('dotenv').config();

const { Client } = require('@notionhq/client');
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const database_id = process.env.NOTION_DATABASE_ID;
const { getTodayInNotionFormat } = require('../utils/dateFormat');

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

const getTodayPenaltyList = async (todoWriters, teamMembers) => {
  todoWriters = await getListTodoWriters();

  teamMembers = await getTeamMembers();

  const getNamesFromTodoWriters = await todoWriters
    .map((name) => Object.keys(name))
    .flat();
  return teamMembers
    .filter((name) => !getNamesFromTodoWriters.includes(name))
    .map((name) => '@' + name);
};

// (async () => {
//   const todoWriters = await getListTodoWriters();
//   console.log(todoWriters, '--ToDoWriters--');

//   const teamMembers = await getTeamMembers();
//   console.log(teamMembers, '--TeamMembers--');

//   const todayPenaltyList = await getTodayPenaltyList(todoWriters, teamMembers);
//   console.log(todayPenaltyList, '--PenaltyList--');
// })();

module.exports = {
  getTeamMembers,
  getListTodoWriters,
  getTodayPenaltyList,
};
