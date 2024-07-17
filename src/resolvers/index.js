import Resolver from '@forge/resolver';
import { sendMessage, getBoard, getActiveSprints, getIssuesForSprints } from './services'
import { countRemainingDays } from './helpers'

const resolver = new Resolver();

resolver.define('generate-summary', async (req) => {
  const foundBoard = await getBoard(req.payload.projectId);
  const activeSprints = await getActiveSprints(foundBoard.id);

  const issues = await getIssuesForSprints(activeSprints);

  const remainingDays = countRemainingDays(activeSprints.map(el => el.endDate));
  await sendMessage(issues, remainingDays);

  return issues;

});

export const handler = resolver.getDefinitions();
