import React from "react";
import useSettingsModal from "./useSettingsModal";
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
  } from '@forge/react';

const SettingsModal = ({ isVisible, setIsVisible }) => {
    const {
        setSetting, 
        slackEndpoint, 
        sprintStatusEnabled, 
        workProgressEnabled,
        setSlackEndpoint,
        setSprintStatusEnabled,
        setWorkProgressEnabled,
    } = useSettingsModal();

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