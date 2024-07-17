class Markdown {
    remainingDays = 2;
    stories = [];

    storyStatusIcons = {
        'To Do': '🤷‍♂️',
        'In Progress': '🟠',
        'Done': '✅'
    };

    constructor(issues) {
        this.stories = issues.filter(i => i.issuetype === 'Story');
    }

    generateMarkdown() {
        const remainingDays = `*Remaining Days*: ${this.remainingDays}\n\n\n`

        let stories = this.stories.reduce((carry, curr) => {
            const key = `<https://youtu.be|[${curr.key}]>`;
            const subtaskProgress = `[${curr.subtasks.length}/${curr.countDoneSubtasks()}]`;
            const storyStatusIcon = this.storyStatusIcons[curr.statusCategory];

            return carry + `\n* ${storyStatusIcon} ${key} ${curr.summary}  ${subtaskProgress}`;
        }, '*Stories*:');

        return remainingDays + stories;
    }
}

export default Markdown;