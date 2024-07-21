import api, { route } from '@forge/api';
import collect, { Collection } from 'collect.js';
import Issue from './Issue';
import { issueTypePluralName } from './helpers'

class Markdown {
    jiraUrl = '';
    issues = [];
    remainingDays = 0;
    storiesByIssueType = [];
    bugGroups = [];
    assignees = [];

    storyStatusIcons = {
        'To Do': '🔘',
        'In Progress': '🔵',
        'Done': '✅'
    };

    /**
     * @param {Issue[]} issues 
     * @param {Number} remainingDays 
     */
    constructor(issues, remainingDays) {
        this.issues = issues;
        this.issuesByIssueType = collect(issues).filter(el => el.issuetype !== 'Bug').groupBy('issuetype');
        this.bugGroups = collect(issues).filter(el => el.issuetype === 'Bug');
        this.remainingDays = remainingDays;


    }

    compareFn(a, b) {
        const keys = Object.keys(this.storyStatusIcons);
        return keys.indexOf(a.statusCategory) > keys.indexOf(b.statusCategory) ? -1 : 1;
    }

    async getJiraInstanceUrl() {
        const { baseUrl } = await (await api.asApp().requestJira(route`/rest/api/2/serverInfo`)).json();
        this.jiraUrl = baseUrl;
    }

    async generateMarkdown() {
        await this.getJiraInstanceUrl();
        const remainingDays = `*Remaining Days*: ${this.remainingDays}\n\n\n`

        const issueTypeSummaries = this
            .issuesByIssueType
            .map((el, idx) => this.generateIssueTypeSummary(idx, el))
            .reduce((carry, item) => carry + item + '\n\n\n', '');
        
        const bugGroupSummary = this.generateIssueTypeSummary('Bug', this.bugGroups); 

        return remainingDays + issueTypeSummaries + bugGroupSummary;
    }

    async generateBlocks() {
        const markdown = await this.generateMarkdown();
        const workToBeDone = this.generateWorkToBeDoneData();

        const elements = workToBeDone
            .map((el, name) => {
                return {
					type: "rich_text_list",
					style: "bullet",
					indent: 0,
					border: 0,
					elements: [
						{
							type: "rich_text_section",
							elements: [
								{
									type: "text",
									text: name,
								}
							]
						}
					]
				};
            }).toArray();
        // console.log(elements)
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
                    type: "divider"
                },
                {
                    type: "rich_text",
                    elements: [
                        {
                            type: "rich_text_section",
                            elements: [
                                {
                                    type: "text",
                                    style: {
                                        bold: true,
                                    },
                                    text: "\n\nGoal of the Day:\n\n"
                                }
                            ]
                        },
                        ...elements,
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

    generateWorkToBeDoneData() {
        const assignedIssuesWithoutSubtasks = collect(this.issues).filter(el => el.subtasks.length === 0 && el.assignee);
        
        const subtasksWithAssignee = collect(this.issues)
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
}

export default Markdown;