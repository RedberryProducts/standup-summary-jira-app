import React from "react";

import { 
    Inline,
    Button, 
    Text, 
    Box,
    Strong,
    TextArea,
    DatePicker,
    Label
} from '@forge/react';
import BaseModal from "../BaseModal/BaseModal";
import GoalsOfTheDayList from "../GoalsOfTheDayList/GoalsOfTheDayList";

const Content = ({ 
    isVisible, 
    setIsVisible,     
    goalsOfTheDay,
    newGoalOfTheDay,
    removeGoalOfTheDay,
    addNewGoalOfTheDay,
    setNewGoalOfTheDay,
    handleSubmit,
    isSubmitFunctionLoading,
    defaultDate,
    handleChange,
    setAdditionalNotes
}) => {
    return (
        <BaseModal isVisible={isVisible} setIsVisible={setIsVisible} title="Content" submitButtonText='Send To Slack' onClick={handleSubmit} isSubmitFunctionLoading={isSubmitFunctionLoading}>
            <Box paddingBlock="space.200">
                <Inline alignBlock="center">
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
                <Inline space="space.100" alignBlock="center">
                    <TextArea 
                        width={600} 
                        name="Add new Goal of the Day" 
                        placeholder="Goal of the Day" 
                        value={newGoalOfTheDay}
                        onChange={(e) => setNewGoalOfTheDay(e.target.value)}
                    />
                    <Button appearance="primary" onClick={addNewGoalOfTheDay}>
                        Add Goal
                    </Button>
                </Inline>
                <Box paddingBlock="space.200">
                    <Label labelFor="area">Additional Notes</Label>
                        <TextArea
                        id="additional-notes-area"
                        placeholder="Enter additional notes"
                        name="additional-notes"
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        />
                    <Label labelFor="date-picker">Choose date</Label>
                    {defaultDate && <DatePicker onChange={(value) => handleChange(value)}  maxDate={new Date().toISOString().split('T')[0]} defaultValue={defaultDate} id="date-picker" />}         
                </Box>
            </Box>
        </BaseModal>        
    );
};

export default Content;