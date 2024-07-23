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
                            style: {
                                bold: true,
                            }
                        },
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

    static createSubtasksWithStory(subtasks, story, jiraUrl) {
        return [
            {
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
                                name: this.issueIcons[story.issuetype],
                            },
                            {
                                type: "text",
                                text: " "
                            },
                            {
                                type: "link",
                                url: `${jiraUrl}/browse/${story.key}`,
                                text: story.key,
                            }
                        ]
                    }
                ]
            },
            ...subtasks.map(el => this.createSubtaskListItem(el, jiraUrl)),
        ];
    }

    static createSubtaskListItem(subtask, jiraUrl) {
        return {
            type: "rich_text_list",
            style: "bullet",
            indent: 2,
            border: 0,
            elements: [
                {
                    type: "rich_text_section",
                    elements: [
                        {
                            type: "emoji",
                            name: "jira-subtask"
                        },
                        {
                            type: "text",
                            text: " ["
                        },
                        {
                            type: "link",
                            url: `${jiraUrl}/browse/${subtask.key}`,
                            text: subtask.key,
                        },
                        {
                            type: "text",
                            text: `] ${subtask.summary}`
                        }
                    ]
                }
            ]
        };
    }
}

export default SlackMessageBlock;