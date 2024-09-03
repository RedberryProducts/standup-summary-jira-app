import { invoke } from '@forge/bridge';
import { useEffect, useState } from 'react';
import useIndex from '../../useIndex'

const useContent = () => {
    const [goalsOfTheDay, setGoalsOfTheDay] = useState([]);
    const [newGoalOfTheDay, setNewGoalOfTheDay] = useState("");

    const {projectId} = useIndex();

    useEffect(() => {
        if(projectId) {
            (async () => {
                const data = await invoke('get-settings', { projectId });
                setGoalsOfTheDay(data.goalsOfTheDay ?? [])
            })();
        }
    }, [projectId]);
    
    const setSetting = async (settings) => {
        await invoke('set-setting', {projectId, settings})
    }

    const removeGoalOfTheDay = (goalToRemove) => {
        const updatedGoalsOfTheDay = goalsOfTheDay.filter(goal => goal !== goalToRemove);
        setGoalsOfTheDay(updatedGoalsOfTheDay);
        setSetting({ goalsOfTheDay: updatedGoalsOfTheDay });
    };

    const addNewGoalOfTheDay = () => {
        if(!goalsOfTheDay || !newGoalOfTheDay || !newGoalOfTheDay.trim()) return

        const updatedGoalsOfTheDay = [...goalsOfTheDay, newGoalOfTheDay];
        setGoalsOfTheDay(updatedGoalsOfTheDay);
        setSetting({ goalsOfTheDay: updatedGoalsOfTheDay });
        setNewGoalOfTheDay(""); 
       
    };

    const clearGoalsOfTheDay = () => {
        setSetting({ goalsOfTheDay: [] });
        setGoalsOfTheDay([])
        setNewGoalOfTheDay('')   
    }

    return {
        goalsOfTheDay,
        newGoalOfTheDay,
        setGoalsOfTheDay,
        setNewGoalOfTheDay,
        setSetting,
        removeGoalOfTheDay,
        addNewGoalOfTheDay,
        clearGoalsOfTheDay
    };
}

export default useContent;