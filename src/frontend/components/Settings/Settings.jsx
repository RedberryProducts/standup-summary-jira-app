import React from "react";

import { Textfield } from '@forge/react';
import BaseModal from "../BaseModal/BaseModal";
import useSettings from "./useSettings";

const Settings = ({ 
    isVisible, 
    setIsVisible,     
}) => {
    const {
        slackEndpoint,
        setSlackEndpoint,
        setSetting
    } = useSettings();

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
        </BaseModal>        
    );
};

export default Settings;
