const core = require('@actions/core')
const github = require('@actions/github')

try {
    const owner = github.context.owner
    const repo = github.context.repo

    //Get input values
    const pr_num = core.getInput(`pr_number`, {required: true})
    const token = core.getInput(`token`, {required: true})

    //Get octokit agent
    const octokit = new github.getOctokit(token)

    //Get files changed in PR
    const { data: changedFiles } = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: pr_num,
    })

    //Get diff data
    let diffData = {
        additions: 0,
        deletions: 0,
        changes: 0,
    }

    //Summarize all diff data and set data to "diffData"
    diffData = changedFiles.reduce((acc, file) => {
      acc.additions += file.additions;
      acc.deletions += file.deletions;
      acc.changes += file.changes;
      return acc;
    }, diffData);
    
    //Create the issue
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pr_number,
      body: `
        Pull Request #${pr_number} has been updated with: \n
        - ${diffData.changes} changes \n
        - ${diffData.additions} additions \n
        - ${diffData.deletions} deletions \n
      `
    });

} catch (error){
    core.setFailed(error.message)
}

