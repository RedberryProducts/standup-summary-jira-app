import { invoke } from '@forge/bridge';
import { useEffect, useState } from 'react';
import useIndex from '../../useIndex'

const useSettings = () => {
    const [slackEndpoint, setSlackEndpoint] = useState('');
    const {projectId} = useIndex();

    useEffect(() => {
        if(projectId) {
            (async () => {
                const data = await invoke('get-settings', { projectId });
                setSlackEndpoint(data.slackEndpoint || '');
            })();
        }
    }, [projectId]);
    
    const setSetting = async (settings) => {
        await invoke('set-setting', {projectId, settings})
    }

    return {
        slackEndpoint,
        setSlackEndpoint,
        setSetting,
    };
}

export default useSettings;