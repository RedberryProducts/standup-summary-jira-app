import React from "react";

import { Text, Box, Stack } from "@forge/react";
import BaseModal from "../BaseModal/BaseModal";

const NoSlackEndpointFound = ({ isVisible, setIsVisible }) => {
  return (
    <BaseModal isVisible={isVisible} setIsVisible={setIsVisible}>
      <Box paddingBlock="space.500">
        <Stack alignInline="start" space="space.400" alignBlock="center">
          <Box>
            <Text>Dear Project( or Product 😜) Manager,</Text>
            <Text>You have not set Slack Channel API hook in settings.</Text>
          </Box>
          <Text>
            Please contact Alpha PM Sandro to obtain above mentioned item.
          </Text>
          <Text>Cheers 🚀</Text>
        </Stack>
      </Box>
    </BaseModal>
  );
};

export default NoSlackEndpointFound;
