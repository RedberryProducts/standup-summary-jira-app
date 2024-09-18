import Resolver from '@forge/resolver';
import { sendMessage, getBoard, getActiveSprints, getIssuesForSprints, getBoardUnreleasedVersions, getBoardStatus } from './services';
import { storage } from '@forge/api';
import { countRemainingDays, selectLatestAttribute, filterDoneIssues, filterToBeDoneIssues} from './helpers';

const resolver = new Resolver();

resolver.define('generate-summary', async (req) => {
  const { projectId, projectKey } = req.payload;

  const foundBoard = await getBoard(projectId);
  const activeSprints = await getActiveSprints(foundBoard.id);

  const { goalsOfTheDay, lastSummaryGenerationDate, selectedStatuses } = await storage.get(`settings-${projectId}`) || {};
  const selectedStatusesValues = selectedStatuses?.map(selectedStatus => selectedStatus.value)

  const issues = await getIssuesForSprints(activeSprints, projectKey);
  const everyIssue = await getIssuesForSprints(activeSprints, projectKey, true)

  await Promise.all(issues.map(el => el.fetchSubtasks(null,null,selectedStatusesValues)));
  await Promise.all(everyIssue.map(el => el.fetchSubtasks(true, lastSummaryGenerationDate)));

  const doneIssues = filterDoneIssues(everyIssue, lastSummaryGenerationDate);
  const toBeDoneIssues = filterToBeDoneIssues(issues, selectedStatusesValues)

  const remainingDays = countRemainingDays(activeSprints.map(el => el.endDate));
  const sprintGoal =  selectLatestAttribute(activeSprints.map(({ goal, endDate }) => ({ goal, endDate })), 'endDate', 'goal'); 

  const boardUnreleasedVersions = await getBoardUnreleasedVersions(foundBoard.id)
  const latestUnreleasedVersion = selectLatestAttribute(boardUnreleasedVersions.map(({ name, releaseDate }) => ({ name, releaseDate })), 'releaseDate', 'name')

  await sendMessage(toBeDoneIssues, latestUnreleasedVersion, sprintGoal, remainingDays, goalsOfTheDay, projectId, doneIssues);
  
  return 'ok';
});

resolver.define('get-status-names', async (req) => {
  const { projectId } = req.payload;
  const foundBoard = await getBoard(projectId);
  return await getBoardStatus(foundBoard.id);
});

resolver.define('get-settings', async (req) => {
  const { projectId } = req.payload;
  const value = await storage.get(`settings-${projectId}`) || {};
  console.log({get: value});
  return value;
});


resolver.define('set-setting', async (req) => {
  const { projectId, settings } = req.payload;
  const keys = Object.keys(settings);

  const currentSettings = await storage.get(`settings-${projectId}`) || {};
  
  keys.forEach(key => {
    currentSettings[key] = settings[key];
  });
  console.log(keys);

  await storage.set(`settings-${projectId}`, currentSettings);
});


export const handler = resolver.getDefinitions();
