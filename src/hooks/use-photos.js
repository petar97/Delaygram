import { useState, useEffect } from 'react';
import { getPhotos } from '../services/firebase';
import useMyPhotos from './use-my-photos';

export default function usePhotos(user) {
  const [photos, setPhotos] = useState(null);

  const myPhotos = useMyPhotos().photos;

  useEffect(() => {
    async function getTimelinePhotos() {
      // does the user actually follow people?
      if (user?.following?.length > 0) {
        const followedUserPhotos = await getPhotos(user.userId, user.following);
        const allPhotos = [...followedUserPhotos, ...myPhotos];
        // re-arrange array to be newest photos first by dateCreated
        allPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(allPhotos);
      }
    }

    getTimelinePhotos();
  }, [user?.userId, user?.following, myPhotos]);

  return { photos };
}