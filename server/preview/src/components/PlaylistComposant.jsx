import React, { useEffect, useState } from 'react';
import useSocketData from '../stores/socketDataStore';

function PlaylistComposant() {
  const { socketData } = useSocketData();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [duration, setDuration] = useState(socketData.playlist.medias[0].duration);

  useEffect(() => {
    const media = socketData.playlist.medias[currentMediaIndex];
    const timer = setTimeout(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % socketData.playlist.medias.length);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [currentMediaIndex, duration]);

  useEffect(() => {
    const media = socketData.playlist.medias[currentMediaIndex];
    setDuration(media.duration);
  }, [currentMediaIndex, socketData.playlist.medias]);

  const currentMedia = socketData.playlist.medias[currentMediaIndex];

  return (
    <div>
      <img className='medias' src={`${import.meta.env.VITE_REACT_APP_FRONT_URL}${currentMedia.path}`} alt={currentMedia.original_file_name} />
    </div>
  );
}

export default PlaylistComposant;