import React from "react";
import { 
    Inline,
    Button, 
    Text, 
    Strong,
  } from '@forge/react';

const GoalsOfTheDayList = ({ goalsOfTheDay, handleRemoveClick }) => {
    return (
        goalsOfTheDay?.map((goalOfTheday, index) => (
            <Inline key={index} space='space.100' alignBlock='center' valign='center'>
                <Inline space='space.100' alignBlock='center'>
                    <Text><Strong>{index + 1}:{'  '} </Strong>{goalOfTheday}</Text>
                </Inline>
            <Button
                appearance='subtle'
                onClick={() => handleRemoveClick(goalOfTheday)}
            >
                X
            </Button>
        </Inline>
           ))
    )
}

export default GoalsOfTheDayList;