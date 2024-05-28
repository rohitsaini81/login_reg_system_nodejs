const apikey="sk-<API_KEY>"
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: apikey });

class AI{


  async AI_req(message){
  try {
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      message: [{ "role": "user", "content": message }],
      max_tokens:100,
      n: 1,
      stop: '\n',
      temperature: 0.7,
    });
    // console.log(completion);
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return ("Internal Error: AI request failed.")
  }
}

}
const Ai = new AI();
module.exports = Ai;