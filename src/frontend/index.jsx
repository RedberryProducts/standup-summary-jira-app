import React, { useState } from 'react';
import useContent from './components/Content/useContent';
import ForgeReconciler, {
  Button, 
  Icon,
  Inline,
} from '@forge/react';
import { Settings, Content } from './components'
import { invoke } from '@forge/bridge';
import useIndex from './useIndex';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [contentOpened, setContentOpened] = useState(false);
  const {projectId, projectKey} = useIndex();
  const {
    setSetting, 
    goalsOfTheDay,
    newGoalOfTheDay,
    removeGoalOfTheDay,
    addNewGoalOfTheDay,
    setNewGoalOfTheDay,
    clearGoalsOfTheDay
} = useContent();

  const summaryGenerationHandler = async () => {
    setIsLoading(true);
    const response = await invoke('generate-summary', { projectId, projectKey });
    if(response === 'ok') clearGoalsOfTheDay();
    setIsLoading(false);
    console.log(response);
  }

  return (
    <>
      <Inline space='space.100'>
        <Button onClick={() => setSettingsOpened(true)} appearance='subtle'>
          <Icon glyph='settings' label='Settings' size='large' />
        </Button>
        <Button onClick={() => setContentOpened(true)} isLoading={isLoading}>Generate Standup Summary</Button>
      </Inline>
      <Settings
          isVisible={settingsOpened} 
          setIsVisible={setSettingsOpened}  
        />
      <Content           
          isVisible={contentOpened} 
          setIsVisible={setContentOpened}
          setSetting={setSetting} 
          goalsOfTheDay={goalsOfTheDay}
          newGoalOfTheDay={newGoalOfTheDay}
          removeGoalOfTheDay={removeGoalOfTheDay}
          addNewGoalOfTheDay={addNewGoalOfTheDay}
          setNewGoalOfTheDay={setNewGoalOfTheDay}
          handleSubmit={summaryGenerationHandler}
          isSubmitFunctionLoading={isLoading}
        />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
