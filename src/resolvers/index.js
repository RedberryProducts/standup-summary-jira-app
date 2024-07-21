import Resolver from '@forge/resolver';
import { sendMessage, getBoard, getActiveSprints, getIssuesForSprints, getSubtasksForIssues } from './services';
import { storage } from '@forge/api';
import { countRemainingDays } from './helpers';
import { collect } from 'collect.js';

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

resolver.define('get-slack-endpoint', async (req) => {
  const { projectId } = req.payload;
  const endpoint = await storage.get(`slack-endpoint-${projectId}`) || '';
  return endpoint;
});


resolver.define('set-slack-endpoint', async (req) => {
  const { projectId, endpoint } = req.payload;
  await storage.set(`slack-endpoint-${projectId}`, endpoint);
});


export const handler = resolver.getDefinitions();
