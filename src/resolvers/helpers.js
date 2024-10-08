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
      const isSubtaskDone = el.statusCategory === 'Done';
      if (!selectedStatuses) return !isSubtaskDone;
      return (
        !isSubtaskDone &&
        (el.subtasks.length > 0 || selectedStatuses.includes(el.status))
      );
    });
  }

  function selectLatestActiveSprint(activeSprints) {
    return activeSprints.reduce((latest, current) =>
      new Date(current[endDate]) > new Date(latest[endDate]) ? current : latest
    );
  }
  
  function selectReleaseVersionsInRange(sprintStartDate, versions) {
    return versions.filter(
      (version) =>
        new Date(version.releaseDate) > new Date(sprintStartDate) ||
        new Date(version.userReleaseDate) > new Date(sprintStartDate)
    );
  }
  
  function formatDate(dateString) {
    if(!dateString) return
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

export {
    countRemainingDays,
    issueTypePluralName,
    selectLatestAttribute,
    filterDoneIssues,
    filterToBeDoneIssues,
    selectLatestActiveSprint,
    selectReleaseVersionsInRange,
    formatDate
}