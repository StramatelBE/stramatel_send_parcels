import React, { useEffect, useState } from 'react';
import useSocketData from '../stores/socketDataStore';

function PlaylistComposant() {
  const { socketData } = useSocketData();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [duration, setDuration] = useState(socketData.playlist.medias[0]?.duration || 0);

  useEffect(() => {
    console.log("socketData.playlist.medias", socketData.playlist);
    if (socketData.playlist.medias.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentMediaIndex + 1) % socketData.playlist.medias.length;
      setCurrentMediaIndex(nextIndex);
      setDuration(socketData.playlist.medias[nextIndex]?.duration || 0);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [currentMediaIndex, duration, socketData.playlist.medias]);

  useEffect(() => {
    if (!socketData.playlist.medias[currentMediaIndex]) {
      setCurrentMediaIndex(0);
      setDuration(socketData.playlist.medias[0]?.duration || 0);
    }
  }, [socketData.playlist.medias, currentMediaIndex]);

  if (socketData.playlist.medias.length === 0) {
    return null;
  }

  const currentMedia = socketData.playlist.medias[currentMediaIndex];

  return (
    <div>
      {currentMedia?.type === 'video' ? (
        <video
          className='medias'
          src={`${import.meta.env.VITE_REACT_APP_FRONT_URL}${currentMedia.path}`}
          autoPlay
          muted
          loop
          preload="auto"
        />
      ) : (
        <img
          className='medias'
          src={`${import.meta.env.VITE_REACT_APP_FRONT_URL}${currentMedia.path}`}
          alt={currentMedia?.original_file_name}
        />
      )}
    </div>
  );
}

export default PlaylistComposant;