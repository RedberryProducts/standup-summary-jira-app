import Markdown from './Markdown';
import Issue from './Issue';
import api, { route } from '@forge/api';
import { message } from './helpers'

const sendMessage = async (issues) => {
    const SLACK_API = 'https://hooks.slack.com/services/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';

    await fetch(SLACK_API, {
        body: message(new Markdown(issues).generateMarkdown()),
        method: 'POST',
    });
}

const getBoard = async (projectId) => {
    const response = await (await api.asApp().requestJira(route`/rest/agile/1.0/board`)).json();
    const { values: boards } = response;
    const foundBoard = boards.find(el => el.location.projectId == projectId);
    return foundBoard;
}

const getActiveSprints = async (boardId) => {
    const { values: sprints } = await (await api.asApp().requestJira(route`rest/agile/1.0/board/${boardId}/sprint`)).json();
    return sprints.filter(el => el.state === 'active');
}

const getIssuesForSprints = async (sprints) => {
    const issuesForSprints = await Promise.all(sprints.map(async (el) => {
        return (await api.asApp().requestJira(route`/rest/agile/1.0/sprint/${el.id}/issue`)).json();
    }));

    const extractedIssues = issuesForSprints.map(el => el.issues).flat();
    const transformedIssues = extractedIssues.map(el => new Issue(el));
    return transformedIssues;
}

export {
    getBoard,
    sendMessage,
    getActiveSprints,
    getIssuesForSprints,
}