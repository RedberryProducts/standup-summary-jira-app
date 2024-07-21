import { getSubtasksForIssue } from './services'

class Issue {
    id;
    key;
    summary;
    issuetype;
    priority;
    status;
    statusCategory;
    assignee;
    parent;
    subtasks = [];

    projectKey;

    constructor(rawIssue, projectKey) {
        this.id = rawIssue.id;
        this.key = rawIssue.key;
        this.summary = rawIssue.fields.summary;
        this.issuetype = rawIssue.fields.issuetype.name;
        this.priority = rawIssue.fields.priority.name;
        this.status = rawIssue.fields.status.name;
        this.assignee = rawIssue.fields.assignee?.displayName;
        this.statusCategory = rawIssue.fields.status.statusCategory.name;

        this.parent = this.issuetype === 'Subtask' ? new Issue(rawIssue.fields.parent) : null;
        this.projectKey = projectKey;
    }

    async fetchSubtasks() {
        if(this.issuetype === 'Subtask') return;
        
        const subtasks = await getSubtasksForIssue(this.projectKey, this.key);
        this.subtasks = subtasks.map(el => new Issue(el));
    }

    countDoneSubtasks() {
        if (!this.subtasks) return 0;
        return this.subtasks.filter(el => el.statusCategory === 'Done').length;
    }
}

export default Issue;
