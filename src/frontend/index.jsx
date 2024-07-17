import React from 'react';
import ForgeReconciler, { Button, useProductContext } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const data = useProductContext();

  const summaryGenerationHandler = async () => {
    const response = await invoke('generate-summary', { projectId: data?.extension?.project.id });
    console.log(response);
  }

  return (
    <>
      <Button onClick={summaryGenerationHandler}>Generate Standup Summary</Button>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
