import { invoke } from '@forge/bridge';
import { useEffect, useState } from 'react';
import useIndex from '../../useIndex'

const useContent = () => {
    const [goalsOfTheDay, setGoalsOfTheDay] = useState([]);
    const [newGoalOfTheDay, setNewGoalOfTheDay] = useState("");
    const [defaultDate, setDefaultDate] = useState('')
    const [additionalNotes, setAdditionalNotes] = useState('');

    const {projectId} = useIndex();

    useEffect(() => {
        if(projectId) {
            (async () => {
                const data = await invoke('get-settings', { projectId });
                setGoalsOfTheDay(data.goalsOfTheDay ?? [])
                setDefaultDate(data?.lastSummaryGenerationDate ?? new Date().toISOString().split('T')[0])
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

    const clearGoalsOfTheDay = async () => {
        await setSetting({ goalsOfTheDay: [] });
        setGoalsOfTheDay([]);
        setNewGoalOfTheDay('');
    }
    
    const clearAdditionalNotes = async () => {
        await setSetting({ additionalNotes: '' });
        setAdditionalNotes('');
    }
    
    const clearContentOnSubmit = async () => {
        await clearGoalsOfTheDay();
        await clearAdditionalNotes();
    }
    const handleChange = (value) => {
        const inputDate = new Date(value);
        const defaultDateObj = new Date(defaultDate);
    
        inputDate.setHours(0, 0, 0, 0);
        defaultDateObj.setHours(0, 0, 0, 0);
    
        const isSameDate = inputDate.getTime() === defaultDateObj.getTime();
    
        const formattedDate = inputDate.toISOString();
        setSetting({lastSummaryGenerationDate: isSameDate ? defaultDate : formattedDate})
    };

     
    const insertAdditionalNotes = () => {
        setSetting({ additionalNotes: additionalNotes })
    }

    return {
        goalsOfTheDay,
        newGoalOfTheDay,
        setGoalsOfTheDay,
        setNewGoalOfTheDay,
        setSetting,
        removeGoalOfTheDay,
        addNewGoalOfTheDay,
        clearContentOnSubmit,
        defaultDate,
        handleChange,
        additionalNotes,
        setAdditionalNotes,
        insertAdditionalNotes,
    };
}

export default useContent;