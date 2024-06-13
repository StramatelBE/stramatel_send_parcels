import { useEffect } from 'react';

import useModes from '../../playlist/hooks/useMode';
import useLoadingStore from '../../../stores/loadingStore';
import usePlaylists from '../../playlist/hooks/usePlaylists';
import useData from '../../data/hooks/useData';
import DashboardComponents from '../components/DashboardComponents';

function DashboardLoader() {
  const { getMode } = useModes();
  const { getAllPlaylists } = usePlaylists();
  const { getAllData } = useData();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      await getMode();
      await getAllPlaylists();
      await getAllData();
      setLoading(false);
    }
    fetchAll();
  }, [getMode, getAllPlaylists, getAllData, setLoading]);

  return <DashboardComponents />;
}

export default DashboardLoader;
