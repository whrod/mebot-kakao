import { Message, RKPlugin } from '@remote-kakao/core';

class LoggerPlugin extends RKPlugin {
  onMessage = async (msg: Message) => {
    this.log(`${msg.sender.name}: ${msg.content}`);
  };
}

export default LoggerPlugin;
