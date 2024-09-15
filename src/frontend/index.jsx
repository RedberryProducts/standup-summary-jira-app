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
    clearContentOnSubmit,
    defaultDate,
    handleChange,
    setAdditionalNotes,
    insertAdditionalNotes,
} = useContent();

  const {
    slackEndpoint,
    setSlackEndpoint,
    setSetting: _setSetting,
    isSettingsDataLoading,
    statuses,
    handleSelectChange,
    selectedStatuses
  } = useSettings();

  const summaryGenerationHandler = async () => {
    insertAdditionalNotes();
    setIsLoading(true);
    const response = await invoke('generate-summary', { projectId, projectKey });
    await setSetting({ lastSummaryGenerationDate: new Date() });
    if(response === 'ok') await clearContentOnSubmit();
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
        {isSettingsDataLoading ? (
          <Spinner size="medium" label="loading" />
        ) : (
          <>
            <Button onClick={() => setSettingsOpened(true)} appearance="subtle">
              <Icon glyph="settings" label="Settings" size="large" />
            </Button>
            <Button
              onClick={handleSummaryGenerationButtonClick}
              isLoading={isLoading}
            >
              Generate Standup Summary
            </Button>
          </>
        )}
      </Inline>
      <NoSlackEndpointFound
          isVisible={noSlackEnpointModalOpened} 
          setIsVisible={setNoSlackEnpointModalOpened}  
        />
      <Settings
          isVisible={settingsOpened} 
          slackEndpoint={slackEndpoint}
          statuses={statuses}
          setSlackEndpoint={setSlackEndpoint}
          setSetting={_setSetting}
          setIsVisible={setSettingsOpened}  
          handleSelectChange={handleSelectChange}
          selectedStatuses={selectedStatuses}
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
