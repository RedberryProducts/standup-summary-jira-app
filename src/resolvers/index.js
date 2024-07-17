import Resolver from '@forge/resolver';
import { sendMessage, getBoard, getActiveSprints, getIssuesForSprints } from './services'

const resolver = new Resolver();

resolver.define('generate-summary', async (req) => {
  const foundBoard = await getBoard(req.payload.projectId);
  const activeSprints = await getActiveSprints(foundBoard.id);
  const issues = await getIssuesForSprints(activeSprints);

  await sendMessage(issues);

  return issues;
});

export const handler = resolver.getDefinitions();
