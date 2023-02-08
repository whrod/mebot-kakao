const commonCommands = {
  pingTest: 'ping',
  sessionTest: 'session',
  manual: [
    '노션',
    '설명서',
    '케이씨',
    'KC',
    'manual',
    '메뉴',
    '메뉴얼',
    '매뉴얼',
    'ㅁㄴㅇ',
    'ㅅㅁㅅ',
    'ㅁㄴ',
  ],
};

const commonReplyMessages = {
  msgPong: 'pong',
  msgAlarmTest: 'AlarmTest',
};

const notionCommands = {
  todoList: ['투두리스트', '오늘투두', '투두', 'ㅌㄷ', 'ㅌㄷㄹㅅㅌ'],
  todoPenalty: ['투두벌금', '투벌', 'ㅌㅂ', 'ㅌㄷㅂㄱ'],
  teamMember: ['팀원', '멤버', '팀멤버', 'ㅌㅇ', 'ㅌㅁㅂ', 'ㅁㅂ'],
  interviewList: ['면접질문', '면질', '면접', 'ㅁㅈ'],
  cmdAlarmTodoMorning: 'morning9:00',
  cmdAlarmTodoPenalty: 'afternoon14:01',
  blogList: ['블로그', '블로그리스트', '블리', 'ㅂㄹㄱㄹㅅㅌ', 'ㅂㄹㄱ'],
  snsList: [
    '조경찬',
    '김응수',
    '조준형',
    '정다영',
    '이승훈',
    '김지원',
    '김효성',
    '이승훈',
    '성종화',
    '신주안',
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

const notionReplyMessages = {
  msgAlarmTodoMorning: '굿모닝🙌 투두리스트 작성해주세요!',
  msgCallTodoList: '📢오늘 투두리스트📢',
  msgAlarmTodoPenalty: '😇삼천원!',
  msgNoTodoPenalty: '😌금일 벌금자 없음',
  msgNoLimitTimeTodo: '아직 14:00 안됨 얼렁 쓰세여🤟',
  msgLimitTimeOverTodo: '입금하셨나요😝?',
  msgPenaltyAccount: '3333252512314 카카오뱅크',
  msgNoTodoList: '투두 아직 아무도 안씀!!😤',
  msgInterviewList: '💾면접질문DB💾',
  msgCallBlogList: '🖼️이번주 블로그리스트🖼️',
  msgNoThisWeekBlog: '블로그 아직 아무도 안씀!!😤',
  msgCallBlogPenaltyLIst: '아직 안쓰신분: ',
  msgCallSnsList: `님의 SNS🐹`,
};

const openAiReplyMessages = {
  msgDelayInfo:
    '시간이 오래 걸릴 수 있습니다. \n추가로 검색하지 말고 잠시 기다려주세요. \n256byte까지 출력됩니다.',
};

const limitTimes = {
  todoLimitHour: 14,
  todoLimitMinute: 1,
};

const manual = `KC bot MANUAL

⏰알람⏰
평일 09:00 투두리스트 알람
평일 14:01 투두 벌금 알람

☢chatGPT☢︎
^하고 커맨드 입력하세요
ex: ^안녕?, ^Hello World!

📅노션 챗봇📅
>하고 커맨드 입력하세요
ex: >설명서, >투두, >투두벌금, >팀원

설명서: 
'노션', '설명서', '케이씨', 'KC', 'manual', '메뉴, '메뉴얼', '매뉴얼' 'ㅁㄴㅇ', 'ㅅㅁㅅ', 'ㅁㄴ'

금일 투두리스트: 
'투두리스트', '오늘투두', '투두', 'ㅌㄷ', 'ㅌㄷㄹㅅㅌ'

금일 투두벌금리스트: 
'투두벌금', '투벌', 'ㅌㅂ', 'ㅌㄷㅂㄱ'

팀원 리스트:
'팀원', '멤버', '팀멤버', 'ㅌㅇ', 'ㅌㅁㅂ', 'ㅁㅂ'

면접 질문 리스트:
'면접', '면접질문', '면질', 'ㅁㅈ'

작성 블로그 리스트:
'블로그', '블로그리스트', '블리', 'ㅂㄹㄱㄹㅅㅌ', 'ㅂㄹㄱ'

팀원 SNS 조회
'팀원이름' (ex: >조경찬)`;

module.exports = {
  commonCommands,
  commonReplyMessages,
  notionCommands,
  sendMsgRooms,
  receiveMsgRooms,
  notionReplyMessages,
  limitTimes,
  manual,
  openAiReplyMessages,
};
