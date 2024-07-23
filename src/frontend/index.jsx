import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
  LoadingButton, 
  Textfield,
  Box,
  Button, 
  Text, 
  Icon,
  Inline,
} from '@forge/react';
import {SettingsModal} from './components'
import { invoke } from '@forge/bridge';
import useIndex from './useIndex';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const {projectId, projectKey} = useIndex();

  const summaryGenerationHandler = async () => {
    setIsLoading(true);
    const response = await invoke('generate-summary', { projectId, projectKey });
    setIsLoading(false);
    console.log(response);
  }

  return (
    <>
      <Inline space='space.100'>
        <Button onClick={() => setSettingsOpened(true)} appearance='subtle'>
          <Icon glyph='settings' label='Settings' size='large' />
        </Button>
        <LoadingButton onClick={summaryGenerationHandler} isLoading={isLoading}>Generate Standup Summary</LoadingButton>
      </Inline>
      <SettingsModal isVisible={settingsOpened} setIsVisible={setSettingsOpened} />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
