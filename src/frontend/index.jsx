import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Button, useProductContext, Textfield, Text, Icon } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const data = useProductContext();
  const [projectId, setProjectId] = useState(null)
  const [slackEndpoint, setSlackEndpoint] = useState(null);

  useEffect(() => {
    if(data?.extension?.project.id) {
      setProjectId(data?.extension?.project.id);
    }
  }, [data]);

  useEffect(() => {
    if(projectId)
    {
      (async() => {
        const response = await invoke('get-slack-endpoint', { projectId });
        setSlackEndpoint(response);
      })()
    }
  }, [projectId]);

  const slackEndpointUpdateHandler = async (e) => {
    setSlackEndpoint(e.target.value);
    await invoke('set-slack-endpoint', { projectId, endpoint: e.target.value });
  }

  const summaryGenerationHandler = async () => {
    const response = await invoke('generate-summary', { projectId });
    console.log(response);
  }

  return (
    <>
      <Icon glyph='settings' label='Settings' size='large' />
      <Textfield width={600} name='Slack Channel Endpoint' value={slackEndpoint} onChange={slackEndpointUpdateHandler} />
      <Text />
      <Button onClick={summaryGenerationHandler}>Generate Standup Summary</Button>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
