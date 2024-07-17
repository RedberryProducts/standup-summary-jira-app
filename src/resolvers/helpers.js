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

export {
    message,
    countRemainingDays,
}