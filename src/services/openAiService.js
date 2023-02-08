require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const runCompletion = async (cmd) => {
  try {
    // console.log('-------------service-------------');
    // console.log(cmd);
    const res = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: cmd,
      max_tokens: 256,
      n: 1,
      temperature: 0,
      top_p: 1,
      stop: '',
    });
    // console.log('-------------------');
    // console.log('📢service:', completion.data);
    // console.log('-------------------');
    return res.data.choices[0].text.trim();
  } catch (err) {
    console.error(err);
    return `Error: ${err.response.statusText}`;
  }
};

module.exports = {
  runCompletion,
};
