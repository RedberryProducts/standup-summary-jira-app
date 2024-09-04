import Markdown from './Markdown';
import Issue from './Issue';
import api, { route, storage } from '@forge/api';

const sendMessage = async (issues, latestUnreleasedVersion, sprintGoal, remainingDays, goalsOfTheDay, projectId) => {
    const { slackEndpoint }= await storage.get(`settings-${projectId}`) || {};
    const body = await (new Markdown(issues, latestUnreleasedVersion, sprintGoal, remainingDays, goalsOfTheDay)).generateBlocks();
    await api.fetch(slackEndpoint, {
        body: JSON.stringify(body),
        method: 'POST',
    });
}

const getSubtasksForIssue = async (projectKey, parentKey) => {
    const jql = `project = '${projectKey}' AND parent in (${parentKey})`;

    const response  = await (await api.asApp().requestJira(route`/rest/api/3/search?jql=${jql}`)).json();
    return response.issues;
}

const getBoard = async (projectId) => {
    const response = await (await api.asApp().requestJira(route`/rest/agile/1.0/board?projectKeyOrId=${projectId}`)).json();
    const { values: boards } = response;
    const foundBoard = boards.find(el => el.location.projectId == projectId);
    return foundBoard;
}

const getActiveSprints = async (boardId) => {
    const { values: sprints } = await (await api.asApp().requestJira(route`rest/agile/1.0/board/${boardId}/sprint`)).json();
    return sprints.filter(el => el.state === 'active');
}

const getIssuesForSprints = async (sprints, projectKey) => {
    const issuesForSprints = await Promise.all(sprints.map(async (el) => {
        return (await api.asApp().requestJira(route`/rest/agile/1.0/sprint/${el.id}/issue?expand=assignee`)).json();
    }));

    const extractedIssues = issuesForSprints.map(el => el.issues).flat();
    const transformedIssues = extractedIssues.map(el => new Issue(el, projectKey));
    return transformedIssues;
}

const getBoardUnreleasedVersions = async (boardId) => {
    const { values: versions } = await (await api.asApp().requestJira(route`rest/agile/1.0/board/${boardId}/version?released=false`)).json();    
    return versions;
}

export {
    getBoard,
    sendMessage,
    getActiveSprints,
    getIssuesForSprints,
    getSubtasksForIssue,
    getBoardUnreleasedVersions
}
