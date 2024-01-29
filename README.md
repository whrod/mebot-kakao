# 메신저R봇 앱 & remote-kakao 카카오톡 봇

## Demo Video

[![KCbot Demo Video](http://img.youtube.com/vi/tsswjg-nQ9s/0.jpg)](https://youtu.be/tsswjg-nQ9s?t=0s)

## API 활용 기능

### 1.카톡 메세지 알람 및 2.chatGPT 3.NotionAPI

1. 09:00 투두리스트 알람, 14:01 벌금리스트 알람

- [x] 알람 기능
  - [x] 오픈톡방 커맨드 응답 활용 구현
  - [ ] Socket(dgram) 활용 구현

2. chatGPT chatbot 구현

- [x] chatGPT 챗봇  
       command : ^ + command  
       ex: '^안녕?', '^TS와 JS의 차이점은?'

3. 노션 관련 - >설명서, >팀원, >투두리스트, >투두벌금, >면접질문

- [x] 노션 매뉴얼  
       command : >' + 노션', '설명서', '케이씨', 'KC', 'manual', 'ㅁㄴㅇ', 'ㅅㅁㅅ'

- [x] 스터디 그룹 멤버 확인  
       command : > + '팀원', '멤버', '팀멤버', 'ㅌㅇ', 'ㅌㅁㅂ', 'ㅁㅂ'

- [x] 오늘 스터디 투두 리스트 확인  
       command : > + '투두리스트', '오늘투두', '투두', 'ㅌㄷ', 'ㅌㄷㄹㅅㅌ'

- [x] 오늘 스터디 투두 리스트 미작성자 확인  
       command : > + '투두벌금', '투벌', 'ㅌㅂ', 'ㅌㄷㅂㄱ'

- [x] 면접 질문리스트 url 호출  
       command : > + '면접', '면접질문', '면질', 'ㅁㅈ'

- [x] 블로그 작성 리스트 호출  
       command : > + '블로그', '블로그리스트', '블리', 'ㅂㄹㄱㄹㅅㅌ', 'ㅂㄹㄱ'

- [x] 팀원 개인별 SNS 리스트 호출  
       command : > + 팀원이름 (ex: >조경찬)

## 배포

- [x] 배포(Github Action, Docker, EC2 CI/CD 구축)
- [x] Docker Container 로그 관리(logrotate, crontab)

## usage

`yarn install`<br>
`yarn pm2 install typescript`<br>
`yarn start` or `yarn pm2 start dev.pm2.config.json`

**로컬에서 PM2 운영시 pm2.env 추가 필요**

```JSON
//ex: dev.pm2.config.json
{
  "apps": [
    {
      "name": "mebot-kakao",
      "cwd": "src",
      "script": "ts-node index.ts",
      "watch": true,
      "autorestart": true,
      "max_memory_restart": "",
      "env": {
        "NOTION_TOKEN": "your api token",
        "NOTION_DATABASE_ID": "your database id",
        "NOTION_PAGE": "notion page"
      }
    }
  ]
}
```

## 기타(TODO:)

- [x] 리팩토링

  - [x] 상수관리
  - [x] 함수mapping, 분리
  - [x] 서비스,컨트롤러 레이어 분리

- [x] 테스트코드

  - [x] 서비스레이어 유닛테스트
  - [ ] 컨트롤러레이어 유닛테스트

## 추가 기능 구현 목록

- [x] 블로그 작성 확인 메소드 구성
- [ ] 벌금 DB, 계산, 알람
- [x] chatGPT API 연동
- [ ] Upbit API 연동 (실시간 현재가)
- [x] 주말 관련 로직

## build test
