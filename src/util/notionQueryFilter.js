const convertDate = require('./dateFormat');

const blogFilter = {
  property: '날짜',
  date: {
    this_week: {},
  },
};

const todoFilter = {
  property: '날짜',
  date: {
    equals: convertDate.getKoreanDate(),
  },
};

module.exports = {
  blogFilter,
  todoFilter,
};
