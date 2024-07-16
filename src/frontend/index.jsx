import React, { useEffect } from 'react';
import ForgeReconciler, { Button, useProductContext } from '@forge/react';
import api, { invoke } from '@forge/bridge';

const App = () => {
    const data = useProductContext();

    useEffect(() => {
        if(data?.extension?.project.id)
        {
            (async function () {
                    const result = await invoke('generate-summary', {projectId: data?.extension?.project.id});
                    console.log(result);
            })()
        }
    }, [data])
    
    const summaryGenerationHandler = () => {
        
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
