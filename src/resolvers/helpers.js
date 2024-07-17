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

export {
    message,
}