import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import * as ROUTES from '../constants/routes';
import useUser from '../hooks/use-user';
import { DEFAULT_IMAGE_PATH } from '../constants/paths';
import ModalContext from '../context/modal';

export default function Header() {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const { firebase } = useContext(FirebaseContext);
  const { setOpen } = useContext(ModalContext);
  const navigate = useNavigate();
  
  return (
    <header className="h-16 bg-white border-b border-gray-primary mb-8 sticky top-0 z-50">
      <div className="px-2 lg:mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 flex items-center">
            <h1 className="w-full text-2xl font-semibold cursor-pointer ">
              <Link to={ROUTES.DASHBOARD} aria-label="Delaygram logo">
                Delaygram
              </Link>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {loggedInUser ? (
              <>
                {/* Home icon */}
                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <svg
                    className="w-7 text-black-light cursor-pointer hover:scale-125 transition-all duration-150 ease-out"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </Link>

                {/* Plus icon */}
                <button
                  type='button'
                  title='Add photo'
                  onClick={() => setOpen(true)}
                >
                  <svg
                    className='w-7 text-black-light cursor-pointer hover:scale-125 transition-all duration-150 ease-out'
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </button>

                {/* Sign out icon */}
                <button
                  type="button"
                  title="Sign Out"
                  onClick={() => {
                    firebase.auth().signOut();
                    navigate(ROUTES.LOGIN);
                  }}
                >
                  <svg
                    className="w-7 text-black-light cursor-pointer hover:scale-125 transition-all duration-150 ease-out"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>

                {user && (
                  <div className="flex items-center cursor-pointer">
                    <Link to={`/p/${user?.username}`}>
                      <img
                        className="rounded-full h-8 w-8 hover:scale-125 transition-all duration-150 ease-out"
                        src={`/images/avatars/${user?.username}.jpg`}
                        alt={`${user?.username} profile`}
                        onError={(e) => {
                          e.target.src = DEFAULT_IMAGE_PATH;
                        }}
                      />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                  >
                    Login
                  </button>
                </Link>
                <Link to={ROUTES.SIGN_UP}>
                  <button
                    type="button"
                    className="font-bold text-sm rounded text-blue-medium w-20 h-8"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}