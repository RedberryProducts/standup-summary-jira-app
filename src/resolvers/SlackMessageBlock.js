class SlackMessageBlock
{
    static issueIcons = {
        'Story': 'jira-story',
        'Task': 'jira-task',
        'QOLI': 'jira-qoli',
        'Bug': 'jira-bug',
    }

    static createAssigneeListItem(name) {
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
    }

    static createStandaloneListItem(issue, jiraUrl) {
        return {
            type: "rich_text_list",
            style: "bullet",
            indent: 1,
            border: 0,
            elements: [
                {
                    type: "rich_text_section",
                    elements: [
                        {
                            type: "emoji",
                            name: this.issueIcons[issue.issuetype],
                        },
                        {
                            type: "text",
                            text: " ["
                        },
                        {
                            type: "link",
                            url: `${jiraUrl}/browse/${issue.key}`,
                            text: issue.key,
                        },
                        {
                            type: "text",
                            text: `] ${issue.summary}`
                        }
                    ]
                },
            ]
        };
    }
}

export default SlackMessageBlock;