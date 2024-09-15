import { invoke } from "@forge/bridge";
import { useEffect, useState } from "react";
import useIndex from "../../useIndex";

const useSettings = () => {
  const [slackEndpoint, setSlackEndpoint] = useState("");
  const { projectId } = useIndex();
  const [isSlackEnpointLoading, setIsSlackEndpointLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (projectId) {
        setIsSlackEndpointLoading(true);
        const data = await invoke("get-settings", { projectId });
        setSlackEndpoint(data.slackEndpoint || "");
        setIsSlackEndpointLoading(false);
      }
    };
    fetchSettings();
  }, [projectId]);

  const setSetting = async (settings) => {
    await invoke("set-setting", { projectId, settings });
  };

  const handleSelectChange = (selectedStatuses) => {
    setSelectedStatuses(selectedStatuses);
    setSetting({ selectedStatuses: selectedStatuses });
  };

  return {
    slackEndpoint,
    setSlackEndpoint,
    setSetting,
    isSlackEnpointLoading,
    statuses,
    handleSelectChange,
    selectedStatuses,
  };
};

export default useSettings;