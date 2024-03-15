import { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import usePhotos from '../hooks/use-photos';
import Post from './post';
import LoggedInUserContext from '../context/logged-in-user';
import useMyPhotos from '../hooks/use-my-photos';

export default function Timeline() {

  const { user } = useContext(LoggedInUserContext);

  const { user: { following } = {} } = useContext(
    LoggedInUserContext
  );

  const { photos } = usePhotos(user);
  const myPhotos = useMyPhotos().photos;

  return (
    <div className="container mx-auto col-span-3 lg:col-span-2">
      {
        following === undefined || myPhotos === null ? (
          <Skeleton count={2} width={640} height={500} className="mb-5" />
        ) : following.length === 0 ? (
          myPhotos.map((content) => <Post key={content.docId} content={content} />)
        ) : photos ? (
          photos.map((content) => <Post key={content.docId} content={content} />)          
      ) : null
      }
    </div>
  );
}
