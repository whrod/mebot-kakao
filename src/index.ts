import { Server, Message } from '@remote-kakao/core';
// import KakaoLinkPlugin from '@remote-kakao/kakaolink-plugin';
import LoggerPlugin from '../plugins/logger';

// 카카오링크 플러그인 컨피그
const config = {
  email: 'shi0206@naver.com', // 카카오 디벨로퍼 계정 이메일
  password: 'cho1514!', // 카카오 디벨로퍼 계정 비밀번호
  key: '2c5b685aef14b6088cfd05b003d98d51', // 카카오 디벨로퍼 애플리케이션 JS 키
  host: 'http://localhost:3000', // 카카오 디벨로퍼 Web 플랫폼 호스트
};

const prefix = '>';
const server = new Server();

server.usePlugin(LoggerPlugin);
// server.usePlugin(KakaoLinkPlugin, config);

server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === 'ping') {
    /*
      메신저봇과 카카오톡 서버간의 핑이 아닌,
      Node.js와 메신저봇간의 핑입니다.
    */
    const timestamp = Date.now();
    await msg.reply('Pong!');
    msg.reply(`${Date.now() - timestamp}ms`);
  }

  // else if (cmd === 'kakaolink') {
  //   msg.replyKakaoLink({
  //     id: 88732, // 여기에 카카오 디벨로퍼 메시지 템플릿 코드 입력
  //     args: {},
  //   });
  // }
});
//TODO: 메세지를 받으면 특정 룸에 리플라이 하는 방법

server.start(3000);
