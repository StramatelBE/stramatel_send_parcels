import { useEffect } from 'react';

import useModes from '../../playlist/hooks/useMode';
import useLoadingStore from '../../../stores/loadingStore';
import usePlaylists from '../../playlist/hooks/usePlaylists';
import useData from '../../data/hooks/useData';
import DashboardComponents from '../components/DashboardComponents';
import useAccident from '../../accident/hooks/useAccident';

function DashboardLoader() {
  const { getMode } = useModes();
  const { getAllPlaylists } = usePlaylists();
  const { getAllData } = useData();
  const { setLoading } = useLoadingStore();
  const { getAllAccidents } = useAccident();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      await getMode();
      await getAllPlaylists();
      await getAllData();
      await getAllAccidents();
      setLoading(false);
    }
    fetchAll();
  }, [getMode, getAllPlaylists, getAllData, setLoading, getAllAccidents]);

  return <DashboardComponents />;
}

export default DashboardLoader;
