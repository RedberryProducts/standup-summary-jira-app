import { invoke } from '@forge/bridge';
import { useEffect, useState } from 'react';
import useIndex from '../../useIndex'

const useSettingsModal = () => {
    const [slackEndpoint, setSlackEndpoint] = useState('');
    const [sprintStatusEnabled, setSprintStatusEnabled] = useState(false);
    const [workProgressEnabled, setWorkProgressEnabled] = useState(false);

    const {projectId} = useIndex();

    useEffect(() => {
        if(projectId) {
            (async () => {
                const data = await invoke('get-settings', { projectId });
                setSlackEndpoint(data.slackEndpoint || '');
                setSprintStatusEnabled(data.sprintStatusEnabled);
                setWorkProgressEnabled(data.workProgressEnabled);
            })();
        }
    }, [projectId]);
    
    const setSetting = async (settings) => {
        await invoke('set-setting', {projectId, settings})
    }

    return {
        slackEndpoint,
        sprintStatusEnabled,
        workProgressEnabled,
        setSlackEndpoint,
        setSprintStatusEnabled,
        setWorkProgressEnabled,
        setSetting,
    };
}

export default useSettingsModal;