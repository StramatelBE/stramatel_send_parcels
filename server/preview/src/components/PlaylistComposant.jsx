import React, { useEffect, useState } from 'react';
import useSocketData from '../stores/socketDataStore';

function PlaylistComposant() {
  const { socketData } = useSocketData();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [duration, setDuration] = useState(socketData.playlist.medias[0]?.duration || 0);

  useEffect(() => {
    const media = socketData.playlist.medias[currentMediaIndex];
    if (media) {
      const timer = setTimeout(() => {
        setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % socketData.playlist.medias.length);
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentMediaIndex, duration, socketData.playlist.medias]);

  useEffect(() => {
    const media = socketData.playlist.medias[currentMediaIndex];
    if (media) {
      setDuration(media.duration);
    } else {
      setCurrentMediaIndex(0);
    }
  }, [currentMediaIndex, socketData.playlist.medias]);

  const currentMedia = socketData.playlist.medias[currentMediaIndex];

  if (!currentMedia) {
    return null;
  }

  return (
    <div>
      {currentMedia.type === 'video' ? (
        <video
          className='medias'
          src={`${import.meta.env.VITE_REACT_APP_FRONT_URL}${currentMedia.path}`}
          autoPlay
          loop
        />
      ) : (
        <img
          className='medias'
          src={`${import.meta.env.VITE_REACT_APP_FRONT_URL}${currentMedia.path}`}
          alt={currentMedia.original_file_name}
        />
      )}
    </div>
  );
}

export default PlaylistComposant;