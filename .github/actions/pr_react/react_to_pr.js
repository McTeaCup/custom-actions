//Requierd dependencies
const github = require('@actions/github')
const core = require('@actions/core')

async function run() {
    const myToken = core.getInput('myToken')
    const bot = github.getOctokit(myToken)

    const context = github.context;
    const author = context.actor

    let currentDate = new Date().toJSON().slice(0, 10);
    let currentTime = new Date().toJSON().slice(11, 16);

    console.log(`A new pull request has been created by ... at ${currentDate} (${currentTime} UTC+0)`)

    const newComment = await bot.rest.issues.create({
        ...context,
        owner: context.owner,
        repo: context.repo,
        body: `A new pull request has been created by ${author.toString()} at ${new Date.toJSON}`
    });
}

run();
