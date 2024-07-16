import Resolver from '@forge/resolver';
import api, {route} from '@forge/api'

const findProjectBoard = (allBoardsResult, projectId) => {
  const {values: boards} = allBoardsResult;
  const foundBoard = boards.find(el => el.location.projectId == projectId);
  return foundBoard;
}

const getBoard = async (projectId) => {
  const response = await (await api.asApp().requestJira(route`/rest/agile/1.0/board`)).json();
  return findProjectBoard(response, projectId);
}


const resolver = new Resolver();

resolver.define('generate-summary', async (req) => {
  const foundBoard = await getBoard(req.payload.projectId);
  const data = await(await api.asApp().requestJira(route`rest/agile/1.0/board/${foundBoard.id}/sprint`)).json();
  return data;
});

export const handler = resolver.getDefinitions();
