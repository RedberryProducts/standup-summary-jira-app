import api, { route } from '@forge/api';
import collect, { Collection } from 'collect.js';
import Issue from './Issue';
import { issueTypePluralName } from './helpers'
import SlackMessageBlock from './SlackMessageBlock'

class Markdown {
    jiraUrl = '';
    issues = [];
    latestUnreleasedVersion = '';
    sprintGoal = '';
    remainingDays = 0;
    goalsOfTheDay = [];
    storiesByIssueType = [];
    bugGroups = [];
    doneBugGroups = [];
    assignees = [];

    storyStatusIcons = {
        'To Do': '🔘',
        'In Progress': '🔵',
        'Done': '✅'
    };

    /**
     * @param {Issue[]} issues 
     * @param {String} latestUnreleasedVersion 
     * @param {String} sprintGoal 
     * @param {Number} remainingDays 
     * @param {String[]} goalsOfTheDay 
     */
    constructor(issues, latestUnreleasedVersion, sprintGoal, remainingDays, goalsOfTheDay, doneIssues) {
        this.issues = issues;
        this.doneIssues = doneIssues;
        this.issuesByIssueType = collect(issues).filter(el => el.issuetype !== 'Bug').groupBy('issuetype')
        this.doneIssuesByIssueType = collect(doneIssues).filter(el => el.issuetype !== 'Bug').groupBy('issuetype');
        this.bugGroups = collect(issues).filter(el => el.issuetype === 'Bug');
        this.doneBugGroups = collect(doneIssues).filter(el => el.issuetype === 'Bug');
        this.latestUnreleasedVersion = latestUnreleasedVersion;
        this.sprintGoal = sprintGoal;
        this.remainingDays = remainingDays;
        this.goalsOfTheDay = goalsOfTheDay;
        
    }

    compareFn(a, b) {
        const keys = Object.keys(this.storyStatusIcons);
        return keys.indexOf(a.statusCategory) > keys.indexOf(b.statusCategory) ? -1 : 1;
    }

    async getJiraInstanceUrl() {
        if(this.jiraUrl) return this.jiraUrl;

        const { baseUrl } = await (await api.asApp().requestJira(route`/rest/api/2/serverInfo`)).json();
        this.jiraUrl = baseUrl;

        return baseUrl;
    }

    async generateMarkdown() {
        await this.getJiraInstanceUrl();
        const remainingDays = `*Remaining Days*: ${this.remainingDays}\n`

        const goalsOfTheDayList = this.goalsOfTheDay
        ?.map((goal, index) => `  ${index + 1}.  ${goal}`)
        .join('\n\n');

        let markdown = [
            this.latestUnreleasedVersion && this.latestUnreleasedVersion.length > 0 ? `\n\n\n*Release Version : ${this.latestUnreleasedVersion}*\n\n` : '',
            this.sprintGoal.length > 0 ? `*Sprint Goal*: \n\n${this.sprintGoal}\n\n` : '',
            remainingDays,
            goalsOfTheDayList.length > 0 ? `\n\n*Goal of the Day:*\n\n${goalsOfTheDayList}\n\n\n` : ''
        ].filter(Boolean).join('');    
       
        return markdown;
    }

    async generateBlocks() {
        const markdown = await this.generateMarkdown();
        const workToBeDone = this.generateWorkData(this.issues);
        const doneWork = this.generateWorkData(this.doneIssues)
        const jiraUrl = await this.getJiraInstanceUrl();
        const workToBeDoneElements = this.generateElements(jiraUrl, workToBeDone, this.issues)
        const doneWorkElements = this.generateElements(jiraUrl, doneWork, this.doneIssues)
        return {
            blocks: [
                {
                    type: "section",
                    text: {
                        "type": "mrkdwn",
                        text: markdown
                    }
                },
                {
                    type: "rich_text",
                    elements: [
                        {
                            type: "rich_text_section",
                            elements: [
                                {
                                    type: "text",
                                    text: "\n\n"
                                }
                            ]
                        },
                        {
                            type: "rich_text_section",
                            elements: [
                                {
                                    type: "text",
                                    style: {
                                        bold: true,
                                    },
                                    text: "\n\nJob to be Dones:\n\n"
                                }
                            ]
                        },
                        ...workToBeDoneElements,
                        {
                            type: "rich_text_section",
                            elements: [
                                {
                                    type: "text",
                                    style: {
                                        bold: true,
                                    },
                                    text: doneWorkElements.length > 0 ? "\n\nDones:\n\n" : "\n"
                                }
                            ]
                        },
                        ...doneWorkElements
                    ]
                },
            ]
        };
    }

    /**
     * 
     * @param {String} name 
     * @param {Collection} issues 
     * @returns 
     */
    generateIssueTypeSummary(name, issues) {
        return issues
            .sort((a, b) => this.compareFn.apply(this, [a, b]))
            .reduce((carry, curr) => {
                const key = `<${this.jiraUrl}/browse/${curr.key}|[${curr.key}]>`;
                const subtaskProgress = curr.subtasks.length ? `[${curr.subtasks.length}/${curr.countDoneSubtasks()}]` : '';
                const storyStatusIcon = this.storyStatusIcons[curr.statusCategory];

                return carry + `\n\n* ${storyStatusIcon} ${key} ${curr.summary}  ${subtaskProgress}`;
        }, `*${issueTypePluralName(name)}*:`);
    }

    generateWorkData(issues) {
        const assignedIssuesWithoutSubtasks = collect(issues).filter(el => el.subtasks.length === 0 && el.assignee);
        
        const subtasksWithAssignee = collect(issues)
            .map(el => el.subtasks)
            .flatten(1)
            .filter(el => el.assignee);

        const structuredSubtasksWithAssignee = subtasksWithAssignee
            .groupBy('assignee')
            .map(el => el.groupBy('parent.key'));

        const finalData = structuredSubtasksWithAssignee.map(el => el.put('standaloneIssues', []));
        
        assignedIssuesWithoutSubtasks.each(el => {
            if(! finalData.get(el.assignee)) {
                finalData.put(el.assignee, collect({ standaloneIssues: [] }));
            }

            finalData.get(el.assignee).get('standaloneIssues').push(el);
        });

        return finalData;
    }

    generateElements(jiraUrl, issues, ourIssues) {
        return issues
        .map((el, name) => {
            const storiesWithSubtasks = el
                .filter((el, idx) => idx !== 'standaloneIssues')
                .map((el, storyKey) => {
                    const [story] = ourIssues.filter(el => el.key === storyKey);
                    return SlackMessageBlock.createSubtasksWithStory(el,story, jiraUrl);
            })
            .flatten(1)
            .toArray();
            
            return [
                SlackMessageBlock.createAssigneeListItem(name),
                ...el.get('standaloneIssues').map(el => SlackMessageBlock.createStandaloneListItem(el, jiraUrl)),
                ...storiesWithSubtasks,
                SlackMessageBlock.createEmptyLines(),
            ]
        }).toArray().flat();
    }
}

export default Markdown;