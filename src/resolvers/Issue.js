import { getSubtasksForIssue } from './services'

class Issue {
    id;
    key;
    summary;
    issuetype;
    priority;
    status;
    statusCategory;
    statusCategoryChangeDate;
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
        this.statusCategoryChangeDate = rawIssue.fields.statuscategorychangedate
        this.parent = this.issuetype === 'Subtask' ? new Issue(rawIssue.fields.parent) : null;
        this.projectKey = projectKey;
    }

    async fetchSubtasks(areDone = false, lastGenerationDate, selectedStatuses) {
        if (this.issuetype === 'Subtask') return;
        
        const subtasks = await getSubtasksForIssue(this.projectKey, this.key);
    
        const lastGeneration = new Date(lastGenerationDate);
        const today = new Date();
    
        if (areDone) {
            this.subtasks = subtasks.map(el => new Issue(el)).filter(el => {
                const statusChangedDate = new Date(el.statusCategoryChangeDate);
                return el.statusCategory === 'Done' && statusChangedDate >= lastGeneration && statusChangedDate <= today;
            });
        } else {
            this.subtasks = subtasks.map(el => new Issue(el)).filter(el => {
                const isSubtaskDone = el.statusCategory === 'Done';
                if (!selectedStatuses) return !isSubtaskDone;
                return !isSubtaskDone && selectedStatuses.includes(el.status)
            });
        }
    }
    

    countDoneSubtasks() {
        if (!this.subtasks) return 0;
        return this.subtasks.filter(el => el.statusCategory === 'Done').length;
    }
}

export default Issue;
