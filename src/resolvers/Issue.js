class Issue {
    id;
    key;
    summary;
    issuetype;
    priority;
    status;
    statusCategory;
    subtasks = [];

    constructor(rawIssue) {
        this.id = rawIssue.id;
        this.key = rawIssue.key;
        this.summary = rawIssue.fields.summary;
        this.issuetype = rawIssue.fields.issuetype.name;
        this.priority = rawIssue.fields.priority.name;
        this.status = rawIssue.fields.status.name;
        this.statusCategory = rawIssue.fields.status.statusCategory.name;

        this.subtasks = this.issuetype === 'Subtask' ? null : rawIssue.fields.subtasks.map(el => new Issue(el));
    }

    countDoneSubtasks() {
        if (!this.subtasks) return 0;
        return this.subtasks.filter(el => el.statusCategory === 'Done').length;
    }
}

export default Issue;
