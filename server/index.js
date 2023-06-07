const http = require('http');
const port = 1212;

const requestHandler = async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (request.url.substring(1) == '') {
        response.end('Please enter a task name in the url');
        return;
    } else {
        const generatedText = await runPrompt(request.url.substring(1));
        response.end(generatedText);
    }
    
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    else {
        console.log(`server is listening on ${port}`);
    }
});

require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(config);

async function runPrompt(taskName) {
    const prompt = `make 3 subtasks in a list (list must have no markers such as numbers or bullets but each subtask should be on its own line only one line apart from the last) for ` + taskName;
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
        temperature: 1.0,
    });

    console.log(response.data.choices[0].text)
    return response.data.choices[0].text;
}