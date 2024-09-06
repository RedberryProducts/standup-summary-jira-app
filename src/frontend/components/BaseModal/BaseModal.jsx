import React from "react";

import { 
    ModalTransition,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalBody,
    Button, 
    Modal,
    LoadingButton
} from '@forge/react';

const BaseModal = ({ 
    isVisible, 
    setIsVisible,     
    title,
    submitButtonText,
    onClick,
    isSubmitFunctionLoading,
    children
}) => {
    return (
        isVisible && (
            <ModalTransition>
                <Modal>
                    {title && 
                        <ModalHeader>
                            <ModalTitle>{title}</ModalTitle>
                        </ModalHeader>
                    }
                    <ModalBody>
                        {children}
                    </ModalBody>
                    <ModalFooter>
                        <Button appearance='subtle' onClick={() => setIsVisible(false)}>
                            Close
                        </Button>
                        {submitButtonText && (
                            <LoadingButton
                                onClick={onClick}
                                isLoading={isSubmitFunctionLoading}
                            >
                                {submitButtonText}
                            </LoadingButton>
                        )}
                    </ModalFooter>
                </Modal>
            </ModalTransition>
        )
    );
};

export default BaseModal;
