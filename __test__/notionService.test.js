const notionService = require('../src/services/notionService');

describe('receiving and processing data through the notion API', () => {
  test('Assuming that there is at least one team member, getTeamMembers should return member(s) of team', async () => {
    const teamMembers = await notionService.getTeamMembers();
    const expected = [expect.stringMatching(/^[\w\s\가-힣]*/)];
    expect(teamMembers).toBeDefined();
    expect(teamMembers).toBeInstanceOf(Array);
    expect(teamMembers.length).toBeGreaterThanOrEqual(1);
    expect(teamMembers).toEqual(expect.arrayContaining(expected));
  });

  test('getListTodoWriters should return list of todo writers. An empty array may be returned if no one created it.', async () => {
    const listOfTodoWriters = await notionService.getListTodoWriters();
    expect(listOfTodoWriters).toBeDefined();
    expect(listOfTodoWriters).toBeInstanceOf(Array);
    expect(listOfTodoWriters.length).toBeGreaterThanOrEqual(0);
    listOfTodoWriters.forEach((todoWriter) => {
      expect(todoWriter).toMatch(
        /[\w\s\가-힣]*\(\d+(시|일\,\d+시)\): https:\/\/\S*/
      );
    });
  });

  test('getWritersInTime should return list of people who wrote a to-do list on time. An empty array may be returned if no one created it.', async () => {
    const writersInTime = await notionService.getWritersInTime();
    expect(writersInTime).toBeDefined();
    expect(writersInTime).toBeInstanceOf(Array);
    expect(writersInTime.length).toBeGreaterThanOrEqual(0);
    if (writersInTime.length > 0) {
      const memberName = [expect.stringMatching(/^[\w\s\가-힣]*/)];
      expect(writersInTime).toEqual(expect.arrayContaining(memberName));
    }
  });

  test('getTodayPenaltyList should return List of people who did not write a to-do list in time. If all has been done, an empty array may be returned.', async () => {
    const writersInTime = ['test1', 'test2'];
    const teamMembers = ['test1', 'test2', 'test3'];
    const todoPenaltyList = await notionService.getTodayPenaltyList(
      writersInTime,
      teamMembers
    );

    expect(todoPenaltyList).toBeDefined();
    expect(todoPenaltyList).toBeInstanceOf(Array);
    expect(todoPenaltyList.length).toBeGreaterThanOrEqual(0);
    if (todoPenaltyList.length > 0) {
      const memberName = [expect.stringMatching(/^@[\w\s\가-힣]*/)];
      expect(todoPenaltyList).toEqual(expect.arrayContaining(memberName));
    }
  });
});
