const notionCommands = {
  pingTest: 'ping',
  todoList: ['투두리스트', '오늘투두', '투두', 'ㅌㄷ', 'ㅌㄷㄹㅅㅌ'],
  todoPenalty: ['투두벌금', '투벌', 'ㅌㅂ', 'ㅌㄷㅂㄱ'],
  teamMember: ['팀원', 'ㅌㅇ', 'ㅌㅁㅂ', 'ㅁㅂ', '멤버', '팀멤버'],
  interviewList: ['면접질문', '면질', '면접', 'ㅁㅈ'],
  sessionTest: 'session',
  cmdAlarmTodoMorning: 'morning9:00',
  cmdAlarmTodoPenalty: 'afternoon14:01',
  manual: [
    '설명서',
    'ㅅㅁㅅ',
    'manual',
    '노션설명서',
    '카톡봇',
    '카봇',
    'KC',
    '케이씨',
    'ㅁㄴㅇ',
  ],
};

const sendMsgRooms = {
  alarmSendRoom: 'KCbot',
  testSendRoom: 'KCbot',
};

const receiveMsgRooms = {
  studyRecRoom: '취업뽀개기',
  testRecRoom: '테스트1',
};

const replyMessages = {
  msgPong: 'pong',
  msgAlarmTest: 'AlarmTest',
  msgAlarmTodoMorning: '굿모닝🙌 투두리스트 작성해주세요!',
  msgAlarmTodoPenalty: '😇삼천원!',
  msgNoTodoPenalty: '😌금일 벌금자 없음',
  msgNoLimitTimeTodo: '아직 14:00 안됨 얼렁 쓰세여🤟',
  msgLimitTimeOverTodo: '입금하셨나요😝?',
  msgPenaltyAccount: '3333252512314 카카오뱅크',
  msgNoTodoList: '아직 아무도 안씀!!😤',
  msgInterviewList: '►면접질문DB',
};

const limitTimes = {
  todoLimitHour: 14,
  todoLimitMinute: 1,
};

const notionManual = `KC bot Notion manual

알람)
평일 09:00 투두리스트 알람
평일 14:01 투두 벌금 알람

챗봇)
>하고 커맨드 입력하세요
ex)>설명서, >투두, >투두벌금, >팀원

노션 설명서: 
'노션', '설명서', 케이씨', ''KC', 'manual', 'ㅁㄴㅇ', 'ㅅㅁㅅ'

금일 투두리스트: 
'투두리스트', '오늘투두', '투두', 'ㅌㄷ', 'ㅌㄷㄹㅅㅌ'

금일 투두벌금리스트: 
'투두벌금', '투벌', 'ㅌㅂ', 'ㅌㄷㅂㄱ'

팀원 리스트:
'팀원', '멤버', '팀멤버', 'ㅌㅇ', 'ㅌㅁㅂ', 'ㅁㅂ'

면접 질문 리스트:
'면접', '면접질문', '면질', 'ㅁㅈ'`;

module.exports = {
  notionCommands,
  sendMsgRooms,
  receiveMsgRooms,
  replyMessages,
  limitTimes,
  notionManual,
};
