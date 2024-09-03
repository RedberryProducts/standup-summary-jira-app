import React from "react";
import GoalsOfTheDayList from "../GoalsOfTheDayList/GoalsOfTheDayList";

import { 
    Textfield,
    Toggle,
    Inline,
    Button, 
    Text, 
    Box,
    Strong,
    TextArea,
} from '@forge/react';
import BaseModal from "../BaseModal/BaseModal";

const Settings = ({ 
    isVisible, 
    setIsVisible,     
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
    setNewGoalOfTheDay 
}) => {
    return (
        <BaseModal 
            isVisible={isVisible} 
            setIsVisible={setIsVisible} 
            title="Settings"
        >
            <Textfield 
                width={600} 
                onChange={(e) => {
                    setSlackEndpoint(e.target.value);
                    setSetting({ slackEndpoint: e.target.value });
                }}
                name='Slack Channel Endpoint' 
                placeholder='Slack Endpoint' 
                value={slackEndpoint}
            />
            <Box paddingBlock='space.300'>
                <Inline alignBlock='center'>
                    <Text>Goals of the Day:</Text>
                </Inline>
                <Box paddingBlock="space.300">
                    {goalsOfTheDay.length === 0 ? (
                        <Text>
                            <Strong>No Goals yet...</Strong>
                        </Text>
                    ) : (
                        <GoalsOfTheDayList 
                            goalsOfTheDay={goalsOfTheDay} 
                            handleRemoveClick={removeGoalOfTheDay} 
                        />
                    )}
                </Box>
                <Inline space='space.100' alignBlock='center'>
                    <TextArea 
                        width={600} 
                        name='Add new Goal of the Day' 
                        placeholder='Goal of the Day' 
                        value={newGoalOfTheDay}
                        onChange={(e) => setNewGoalOfTheDay(e.target.value)}
                    />
                    <Button appearance="primary" onClick={addNewGoalOfTheDay}>
                        Add Goal
                    </Button>
                </Inline>
            </Box>
            <Box paddingBlock='space.300'>
                <Inline alignBlock='center'>
                    <Text>Sprint Status</Text>
                    <Toggle 
                        onChange={() => {
                            setSprintStatusEnabled(!sprintStatusEnabled);
                            setSetting({ sprintStatusEnabled: !sprintStatusEnabled });
                        }}                        
                        isChecked={sprintStatusEnabled}
                        name='Sprint Status' 
                    />
                </Inline>
                <Inline alignBlock='center'>
                    <Text>Work Progress</Text>
                    <Toggle 
                        name='Work Progress' 
                        onChange={() => {
                            setWorkProgressEnabled(!workProgressEnabled);
                            setSetting({ workProgressEnabled: !workProgressEnabled });
                        }}         
                        isChecked={workProgressEnabled}
                    />
                </Inline>
            </Box>
        </BaseModal>
    );
}

export default Settings;
