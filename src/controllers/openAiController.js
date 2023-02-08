const {
  commonReplyMessages,
  commonCommands,
  openAiReplyMessages,
} = require('../constants/constants');
const chatGptService = require('../services/openAiService');

const onOpenAiMessage = async (msg, cmd) => {
  const prefix = '^';

  if (!msg.content.startsWith(prefix)) return;

  cmd = msg.content?.slice(prefix.length);

  //pingTest
  //^ping
  if (cmd === commonCommands.pingTest) {
    const timestamp = Date.now();

    try {
      await msg.reply(commonReplyMessages.msgPong);
      msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }

  //chatGPT completion chatbot
  //^command
  if (cmd !== commonCommands.pingTest) {
    const timestamp = Date.now();
    let result = await chatGptService.runCompletion(cmd);

    try {
      await msg.reply(openAiReplyMessages.msgDelayInfo);
      // await Promise.all(msg.reply(result));
      await msg.reply(result);
      await msg.reply(`${Date.now() - timestamp}ms`);
    } catch (err) {
      console.error(err);
      msg.reply(`${err}`);
    }
  }
};

module.exports = {
  onOpenAiMessage,
};
