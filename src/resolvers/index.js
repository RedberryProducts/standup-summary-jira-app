import Resolver from '@forge/resolver';
import { sendMessage, getBoard, getActiveSprints, getIssuesForSprints, getSubtasksForIssues } from './services';
import { storage } from '@forge/api';
import { countRemainingDays } from './helpers';

const resolver = new Resolver();

resolver.define('generate-summary', async (req) => {
  const { projectId, projectKey } = req.payload;
  const foundBoard = await getBoard(projectId);
  const activeSprints = await getActiveSprints(foundBoard.id);

  const issues = await getIssuesForSprints(activeSprints, projectKey);
  await Promise.all(issues.map(el => el.fetchSubtasks()));
  const remainingDays = countRemainingDays(activeSprints.map(el => el.endDate));
  await sendMessage(issues, remainingDays, projectId);
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

  await storage.set(`settings-${projectId}`, settings);
});


export const handler = resolver.getDefinitions();
