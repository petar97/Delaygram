/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useUser from '../../hooks/use-user';
import { doesUsernameExist, getUserFollowers, getUserFollowing, isUserFollowingProfile, toggleFollow } from '../../services/firebase';
import UserContext from '../../context/user';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom';
import FirebaseContext from '../../context/firebase';
import { DASHBOARD, PROFILE } from '../../constants/routes';

export default function Header({
  photosCount,
  followerCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername
  }
}) {
  const navigate = useNavigate();
  const { firebase } = useContext(FirebaseContext);
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;
  const [isFollowingProfile, setIsFollowingProfile] = useState(null);
  const [userFollowerProfiles, setUserFollowerProfiles] = useState(null);
  const [userFollowingProfiles, setUserFollowingProfiles] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  let [editFullName, setEditFullName] = useState('');
  let [editUsername, setEditUsername] = useState('');
  const [error, setError] = useState('');

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleToggleFollow = async () => {
    setIsFollowingProfile(isFollowingProfile => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
    });
    await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const userForEdit = firebase.firestore().collection('users').doc(profileDocId);

    if (editUsername !== '' || editFullName !== '') {
      const usernameExists = await doesUsernameExist(editUsername);
      
      if (editUsername === '' || usernameExists) {
        editUsername = profileUsername;
        setError(error.message)
      }

      if (editFullName === '') {
        editFullName = fullName;
      }

      if (!usernameExists) {
        await userForEdit.update({username: `${editUsername}`});
      }
      await userForEdit.update({fullName: `${editFullName}`});

      navigate(DASHBOARD);
    }
  }

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(user.username, profileUserId);
      setIsFollowingProfile(!!isFollowing);
    };

    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }

    async function userFollowers() {
      const uFollowers = await getUserFollowers(profileUserId, followers);
      setUserFollowerProfiles(uFollowers);
    }

    if (profileUserId && followers) {
      userFollowers()
    }

    async function userFollowing() {
      const uFollowing = await getUserFollowing(profileUserId, following);
      setUserFollowingProfiles(uFollowing)
    }

    if (profileUserId && following) {
      userFollowing()
    }
  }, [user?.username, profileUserId, followers, following]);


  return (
    <div className="px-2 grid grid-cols-3 gap-4 justify-between max-w-screen-lg">
      <div className="container flex items-center justify-center col-span-3 sm:col-span-1">
        {profileUsername ? (
          <img
            className="rounded-full h-40 w-40"
            alt={`${fullName} profile picture`}
            src={`/images/avatars/${profileUsername}.jpg`}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
        ) : (
          <Skeleton circle height={150} width={150} count={1} />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-3 sm:col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl">{profileUsername}</p>
          {activeBtnFollow && isFollowingProfile === null ? (
            <Skeleton count={1} width={80} height={32} />
          ) : (
            activeBtnFollow ? (
              <button
                className="bg-blue-medium hover:bg-opacity-90 font-bold text-sm rounded text-white w-20 h-8 ml-3"
                type="button"
                onClick={handleToggleFollow}
              >
                {isFollowingProfile ? 'Unfollow' : 'Follow'}
              </button>
            ) : (
              <>
                <div className="">
                  <button
                    type="button"
                    onClick={openModal}
                    className="ml-3 px-4 py-2 font-bold text-sm text-black-true border rounded"
                  >
                    Edit profile
                  </button>
                </div>

                <Transition appear show={isOpen} as={Fragment}>
                  <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                  >
                    <div className="min-h-screen px-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Dialog.Overlay className="fixed inset-0" />
                      </Transition.Child>

                      <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                      >
                        &#8203;
                      </span>
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl border">
                          <Dialog.Title
                            as="h3"
                            className="mb-3 text-lg font-medium leading-6 text-gray-900"
                          >
                            Edit your profile
                          </Dialog.Title>
                          <form onSubmit={handleEdit} method="POST">
                            <input
                              aria-label="Change your username"
                              type="text"
                              placeholder="Username"
                              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                              onChange={({ target }) => setEditUsername(target.value)}
                              value={editUsername}
                            />
                            <input
                              aria-label="Change your Full name"
                              type="text"
                              placeholder="Full name"
                              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                              onChange={({ target }) => setEditFullName(target.value)}
                              value={editFullName}
                            />
                            {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
                            <button
                              /* disabled={isInvalid} */
                              type="submit"
                              className={`bg-blue-medium text-white w-full rounded h-8 font-bold`}
                            >
                              Apply
                            </button>
                          </form>
                        </div>
                      </Transition.Child>
                    </div>
                  </Dialog>
                </Transition>
              </>
              /* <button
                className='border rounded w-14 h-8 ml-3'
                type='button'
                onClick={handleEdit}
              >
                Edit
              </button> */
            )
          )}
        </div>
        <div className="container flex mt-4 items-center space-x-6">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p>
                <span className="font-bold">{photosCount}</span> photos
              </p>

              {/* BEGINING */}
              <Menu as="div" className="relative">
                <Menu.Button disabled={!followerCount}>
                  <span className="font-bold">{followerCount}</span>
                  {followerCount === 1 ? ` follower` : ` followers`}
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="z-20 absolute w-56 mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-gray-200">
                    <div className="px-1 py-1 ">
                      {userFollowerProfiles?.map((item) => (
                        <Menu.Item key={item.docId}>
                          {() => (
                            <Link
                              to={`/p/${item.username}`} 
                              className='flex items-center hover:bg-gray-200 p-1 rounded-md'
                            >
                              <img
                                className="rounded-full w-8 h-8 mr-3"
                                src={`/images/avatars/${item.username}.jpg`}
                                alt=""
                                onError={(e) => {
                                  e.target.src = DEFAULT_IMAGE_PATH;
                                }}
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.username}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.fullName}
                                </p>
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              {/* END */}

              <Menu as="div" className="relative">
                <Menu.Button disabled={following.length <= 0}>
                  <span className="font-bold">{following?.length}</span> following
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="z-20 absolute w-56 mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-gray-200">
                    <div className="px-1 py-1 ">
                      {userFollowingProfiles?.map((item) => (
                        <Menu.Item key={item.docId}>
                          {() => (
                            <Link
                              to={`/p/${item.username}`} 
                              className='flex items-center hover:bg-gray-200 p-1 rounded-md'
                            >
                              <img
                                className="rounded-full w-8 h-8 mr-3"
                                src={`/images/avatars/${item.username}.jpg`}
                                alt=""
                                onError={(e) => {
                                  e.target.src = DEFAULT_IMAGE_PATH;
                                }}
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.username}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.fullName}
                                </p>
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          )}
        </div>
        <div className="container flex mt-4">
          <p className="font-medium">{!fullName ? <Skeleton count={1} height={24} /> : fullName}</p>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array
  }).isRequired
};