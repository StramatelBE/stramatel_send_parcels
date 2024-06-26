import { useEffect } from "react";
import useStandbyStore from "../stores/standbyStore";
import useSocketData from "../stores/socketDataStore";

const useStandby = () => {
  const { socketData } = useSocketData();
  const { setStandby, setStandbyTimes, clearStandby, setIsStandby } =
    useStandbyStore();

  useEffect(() => {
    if (socketData?.settings) {
      const { standby, standby_start_time, standby_end_time } =
        socketData.settings;
      setStandby(standby);
      setStandbyTimes(standby_start_time, standby_end_time);

      if (standby) {
        const now = new Date();
        const [startHour, startMinute] = standby_start_time.split(":");
        const [endHour, endMinute] = standby_end_time.split(":");
        const start = new Date(now);
        start.setHours(startHour, startMinute, 0, 0);
        const end = new Date(now);
        end.setHours(endHour, endMinute, 0, 0);

        if (now >= start && now <= end) {
          setIsStandby(true);
          return;
        }
      }
      setIsStandby(false);
    } else {
      clearStandby();
    }
  }, [socketData]);

  return null;
};

export default useStandby;
