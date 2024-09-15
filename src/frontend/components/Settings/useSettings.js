import { invoke } from "@forge/bridge";
import { useEffect, useState } from "react";
import useIndex from "../../useIndex";
import { DEFAULT_STATUSSES } from "../../utils";

const useSettings = () => {
  const [slackEndpoint, setSlackEndpoint] = useState("");
  const { projectId } = useIndex();
  const [isSlackEnpointLoading, setIsSlackEndpointLoading] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (projectId) {
        const statuses = await invoke("get-status-names", { projectId });
        setStatuses(statuses);
        setIsSlackEndpointLoading(true);
        const data = await invoke("get-settings", { projectId });
        setSlackEndpoint(data.slackEndpoint || "");
        setSelectedStatuses(data.selectedStatuses || []);
        const areStatusesNeverSelected =
          typeof data === "object" &&
          !Object.keys(data).includes("selectedStatuses");

        if (areStatusesNeverSelected && statuses.length > 0) {
          statuses.forEach((possiblySelectedBoardStatus) => {
            const isBoardStatusInDefaultStatuses = DEFAULT_STATUSSES.some(
              (defaultStatus) =>
                defaultStatus.value === possiblySelectedBoardStatus.value
            );
            if (isBoardStatusInDefaultStatuses) {
              setSelectedStatuses((prevSelectedStatuses) => [
                ...prevSelectedStatuses,
                possiblySelectedBoardStatus,
              ]);
            }
          });
        }
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