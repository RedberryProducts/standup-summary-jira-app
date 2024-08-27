import React from "react";
import GoalsOfTheDayList from "../GoalsOfTheDayList/GoalsOfTheDayList";

import { 
    ModalTransition,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    Textfield,
    ModalBody,
    Toggle,
    Inline,
    Button, 
    Modal, 
    Text, 
    Box,
    Strong,
    TextArea,
  } from '@forge/react';

const SettingsModal = ({ 
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
        isVisible && <ModalTransition>
            <Modal>
            <ModalHeader>
                <ModalTitle>Settings</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Textfield 
                    width={600} 
                    onChange={(e) => {
                        setSlackEndpoint(e.target.value);
                        setSetting({slackEndpoint: e.target.value});
                    }}
                    name='Slack Channel Endpoint' 
                    placeholder='Slack Endpoint' 
                    value={slackEndpoint}
                />
                <Box paddingBlock='space.300'>
                    <Inline alignBlock='center'>
                        <Text>Sprint Goals:</Text>
                    </Inline>
                    <Box paddingBlock="space.300">
                        {goalsOfTheDay.length === 0 ? (
                            <Text>
                                <Strong>Goals of the Day...</Strong>
                            </Text>
                        ) : (
                            <GoalsOfTheDayList goalsOfTheDay={goalsOfTheDay} handleRemoveClick={removeGoalOfTheDay} />
                        )}
                    </Box>
                    <Inline  space='space.100' alignBlock='center'>
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
                                setSprintStatusEnabled(! sprintStatusEnabled);
                                setSetting({sprintStatusEnabled: ! sprintStatusEnabled});
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
                                setWorkProgressEnabled(! workProgressEnabled);
                                setSetting({workProgressEnabled: ! workProgressEnabled});
                            }}         
                            value={workProgressEnabled}
                        />
                    </Inline>
                </Box>
            </ModalBody>
            <ModalFooter>
                <Button appearance='subtle' onClick={() => setIsVisible(false)}>Close</Button>
            </ModalFooter>
            </Modal>
        </ModalTransition>
    )
}

export default SettingsModal;