import { useState, useEffect } from 'react'
import { useProductContext } from '@forge/react';

const useIndex = () => {
    const data = useProductContext();
    const [projectId, setProjectId] = useState(null);
    const [projectKey, setProjectKey] = useState(null);
  
    useEffect(() => {
      if(data?.extension?.project.id) {
        setProjectId(data?.extension?.project.id);
        setProjectKey(data?.extension?.project.key);
      }
    }, [data]);
    
    return {
        projectId,
        projectKey,
    };
}

export default useIndex;