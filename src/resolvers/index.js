import Resolver from '@forge/resolver';
import { sendMessage, getBoard, getActiveSprints, getIssuesForSprints, getSubtasksForIssues } from './services';
import { storage } from '@forge/api';
import { countRemainingDays, getLatestSprintGoal } from './helpers';

const resolver = new Resolver();

resolver.define('generate-summary', async (req) => {
  const { projectId, projectKey } = req.payload;
  const foundBoard = await getBoard(projectId);
  const activeSprints = await getActiveSprints(foundBoard.id);

  const issues = await getIssuesForSprints(activeSprints, projectKey);
  await Promise.all(issues.map(el => el.fetchSubtasks()));
  const remainingDays = countRemainingDays(activeSprints.map(el => el.endDate));
  const { goalsOfTheDay } = await storage.get(`settings-${projectId}`) || {};
  const sprintGoal =  getLatestSprintGoal(activeSprints.map(({ goal, endDate }) => ({ goal, endDate }))); 
  await sendMessage(issues, remainingDays, projectId, goalsOfTheDay, sprintGoal);
  return 'ok';
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
