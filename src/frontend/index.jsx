import React, { useState } from 'react';
import useSettingsModal from './components/SettingsModal/useSettingsModal';
import ForgeReconciler, {
  LoadingButton, 
  Button, 
  Icon,
  Inline,
} from '@forge/react';
import { SettingsModal } from './components'
import { invoke } from '@forge/bridge';
import useIndex from './useIndex';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const {projectId, projectKey} = useIndex();
  const {
    setSetting, 
    slackEndpoint, 
    sprintStatusEnabled, 
    workProgressEnabled,
    goalsOfTheDay,
    newGoalOfTheDay,
    setSlackEndpoint,
    setSprintStatusEnabled,
    setWorkProgressEnabled,
    removeGoalOfTheDay,
    addNewGoalOfTheDay,
    setNewGoalOfTheDay,
    clearGoalsOfTheDay
} = useSettingsModal();

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
        <LoadingButton onClick={summaryGenerationHandler} isLoading={isLoading}>Generate Standup Summary</LoadingButton>
      </Inline>
      <SettingsModal 
          isVisible={settingsOpened} 
          setIsVisible={setSettingsOpened} 
          setSetting={setSetting} 
          slackEndpoint={slackEndpoint} 
          sprintStatusEnabled={sprintStatusEnabled}
          workProgressEnabled={workProgressEnabled}
          goalsOfTheDay={goalsOfTheDay}
          newGoalOfTheDay={newGoalOfTheDay}
          setSlackEndpoint={setSlackEndpoint}
          setSprintStatusEnabled={setSprintStatusEnabled}
          setWorkProgressEnabled={setWorkProgressEnabled}
          removeGoalOfTheDay={removeGoalOfTheDay}
          addNewGoalOfTheDay={addNewGoalOfTheDay}
          setNewGoalOfTheDay={setNewGoalOfTheDay} 
        />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
