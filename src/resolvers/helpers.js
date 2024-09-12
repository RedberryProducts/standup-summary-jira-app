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
        'DEFAULT': ':black_circle_for_record:'
    };

    if(plurals[name] === undefined) return plurals['DEFAULT'];

    return plurals[name];
}
  function selectLatestAttribute(items, dateField, attribute) {
    if (items.length === 0) return null; 
    
    return items.reduce((latest, current) => 
      new Date(current[dateField]) > new Date(latest[dateField]) ? current : latest
    )[attribute];
  }

  function filterDoneIssues(everyIssue, lastSummaryGenerationDate) {
    const lastGeneration = new Date(lastSummaryGenerationDate);
    const today = new Date();
  
    return everyIssue.filter((el) => {
      const statusChangeDate = new Date(el.statusCategoryChangeDate);
      return (
        (el.statusCategory === 'Done' &&
        statusChangeDate >= lastGeneration &&
        statusChangeDate <= today) ||
        el.subtasks.length > 0
      );
    });
  }

  function filterToBeDoneIssues(everyIssue, selectedStatuses) {
    return everyIssue.filter((el) => {
      return (
        ((el.statusCategory !== 'Done') &&
        (el.subtasks.length > 0 || selectedStatuses.includes(el.status))
      ));
    });
  }
  
export {
    countRemainingDays,
    issueTypePluralName,
    selectLatestAttribute,
    filterDoneIssues,
    filterToBeDoneIssues
}