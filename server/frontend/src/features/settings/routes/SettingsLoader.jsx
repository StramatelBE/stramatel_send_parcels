import { useEffect, useState } from 'react';
import SettingsComposants from '../components/SettingsComposants';
import useSettings from '../hooks/useSettings';

function SettingsLoader() {
  const { getSettings } = useSettings();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      await getSettings();
      setLoading(false);
    }

    fetchSettings();
  }, [getSettings]);

  return <SettingsComposants loading={loading} />;
}

export default SettingsLoader;
