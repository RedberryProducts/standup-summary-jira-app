import api, { route } from '@forge/api';
import collect, { Collection } from 'collect.js';
import Issue from './Issue';
import { issueTypePluralName } from './helpers'

class Markdown {
    jiraUrl = '';
    remainingDays = 0;
    storiesByIssueType = [];
    bugGroups = [];

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
}

export default Markdown;