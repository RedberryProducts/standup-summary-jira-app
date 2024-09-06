import React, { useState } from 'react';
import useContent from './components/Content/useContent';
import useSettings from './components/Settings/useSettings';
import ForgeReconciler, {
  Button, 
  Icon,
  Inline,
  Spinner
} from '@forge/react';
import { Settings, Content, NoSlackEndpointFound } from './components'
import { invoke } from '@forge/bridge';
import useIndex from './useIndex';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [contentOpened, setContentOpened] = useState(false);
  const [noSlackEnpointModalOpened, setNoSlackEnpointModalOpened] = useState(false)
  const {projectId, projectKey} = useIndex();
  const {
    setSetting, 
    goalsOfTheDay,
    newGoalOfTheDay,
    removeGoalOfTheDay,
    addNewGoalOfTheDay,
    setNewGoalOfTheDay,
    clearGoalsOfTheDay,
    defaultDate,
    handleChange,
    setAdditionalNotes,
    insertAdditionalNotes
} = useContent();

  const {
    slackEndpoint,
    setSlackEndpoint,
    setSetting: _setSetting,
    isSlackEnpointLoading
  } = useSettings();

  const summaryGenerationHandler = async () => {
    insertAdditionalNotes();
    setIsLoading(true);
    const response = await invoke('generate-summary', { projectId, projectKey });
    await setSetting({ lastSummaryGenerationDate: new Date() });
    if(response === 'ok') clearGoalsOfTheDay();
    setIsLoading(false);
    console.log(response);
  }
  const handleSummaryGenerationButtonClick = async () => {
      if(!slackEndpoint) {
        setNoSlackEnpointModalOpened(true)
      } else{
        setContentOpened(true)
      }   
  }

  return (
    <>
      <Inline space='space.100'>
        <Button onClick={() => setSettingsOpened(true)} appearance='subtle'>
          <Icon glyph='settings' label='Settings' size='large' />
        </Button>
        {isSlackEnpointLoading ?  
          <Spinner size="medium" label="loading" /> : 
          <Button onClick={handleSummaryGenerationButtonClick} isLoading={isLoading}>
            Generate Standup Summary
          </Button>
        }
      </Inline>
      <NoSlackEndpointFound
          isVisible={noSlackEnpointModalOpened} 
          setIsVisible={setNoSlackEnpointModalOpened}  
        />
      <Settings
          isVisible={settingsOpened} 
          setIsVisible={setSettingsOpened}  
          slackEndpoint={slackEndpoint}
          setSlackEndpoint={setSlackEndpoint}
          setSetting={_setSetting}
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
          defaultDate={defaultDate}
          handleChange={handleChange}
          setAdditionalNotes={setAdditionalNotes}
        />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
