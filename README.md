# 메신저R봇 앱 & remote-kakao 카카오톡 봇

## API 활용 기능

- [x] 스터디 그룹 멤버 확인  
       command : >팀원

- [x] 오늘 스터디 투두 리스트 확인  
       command : >투두리스트

- [x] 오늘 스터디 투두 리스트 미작성자 확인  
       command : >투두벌금

- [x] 투두리스트 알람 기능
  - [x] 오픈톡방 커맨드 응답 활용 구현
  - [ ] Socket(dgram) 활용 구현

## 추가 기능 구현 목록

- [ ] 블로그 작성 확인 메소드 구성
- [ ] 벌금 DB, 계산, 알람
- [ ] chatGPT API 연동
- [ ] Upbit API 연동 (실시간 현재가)
- [ ] 주말, 공휴일 관련 로직

## 배포

- [x] 배포(Github Action, Docker, EC2 CI/CD 구축)

## 기타(TODO:)

- [ ] 리팩토링
  - [ ] 함수 mapping
  - [ ] 상수 관리
- [ ] 에러핸들링
  - [ ] JSON.parse
  - [ ] Promise rejected
- [ ] express router 합치기
- [ ] 테스트코드

## usage

`yarn install`<br>
`npm install`<br>
`yarn start`
