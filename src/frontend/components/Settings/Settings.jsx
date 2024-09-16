import React from "react";

import { Textfield, Label, Select } from '@forge/react';
import BaseModal from "../BaseModal/BaseModal";

const Settings = ({ 
    isVisible, 
    setIsVisible,    
    slackEndpoint,
    setSlackEndpoint,
    setSetting,
    statuses,
    handleSelectChange,
    selectedStatuses
}) => {
    return (
        <BaseModal 
            isVisible={isVisible} 
            setIsVisible={setIsVisible} 
            title="Settings"
            sx={{ height: 700 }}
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
            <Label labelFor="multi-select-example">
                Select statuses to include in summary
            </Label>
            <Select
                inputId="multi-select-example"
                options={statuses}
                defaultValue={selectedStatuses}
                isMulti
                isSearchable={false}
                placeholder="Choose a status"
                onChange={(value) => handleSelectChange(value)}
            />
        </BaseModal>        
    );
};

export default Settings;
