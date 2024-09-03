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
  function selectLatestAttribute(items, dateField, attribute) {
    if (items.length === 0) return null; 
    
    return items.reduce((latest, current) => 
      new Date(current[dateField]) > new Date(latest[dateField]) ? current : latest
    )[attribute];
  }
  
export {
    countRemainingDays,
    issueTypePluralName,
    selectLatestAttribute
}