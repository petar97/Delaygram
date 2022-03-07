import { useState, useEffect, useContext } from 'react';
import { getMyPhotos } from '../services/firebase';
import UserContext from '../context/user';


export default function useMyPhotos() {
  const { user: { uid: userId = '' } } = useContext(UserContext)
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    async function getTimelinePhotos() {
      let myPhotos = []

      if(userId) {
        myPhotos = await getMyPhotos(userId);
      }

      myPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
      setPhotos(myPhotos);
    }
    getTimelinePhotos()
  }, [userId])

 return { photos }
}
