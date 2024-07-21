const message = (markdown) => {
    return JSON.stringify({
        blocks: [
            {
                type: "section",
                text: {
                    "type": "mrkdwn",
                    text: markdown
                }
            }
        ]
    });
}

const countRemainingDays = (dates) => {
    const countDays = (date) => {
        const oneDay = 24 * 60 * 60 * 1000;
        const today = new Date();
        return Math.round(Math.abs((new Date(date) - today) / oneDay));
    }

    const [remainingDays] = dates.map(el => countDays(el)).sort((a, b) => a - b);

    return remainingDays;
}

const issueTypePluralName = (name) => {
    const plurals = {
        'Story': ':jira-story: Stories',
        'Task': ':jira-task: Tasks',
        'Bug': ':jira-bug: Bug Groups',
    };

    if(plurals[name] === undefined) return name;

    return plurals[name];
}

export {
    message,
    countRemainingDays,
    issueTypePluralName,
}