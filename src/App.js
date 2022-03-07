import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import UserContext from './context/user';
import useAuthListener from './hooks/use-auth-listener';
import ProtectedRoute from './helpers/protected-route';
import ReactLoader from './components/loader';
import ModalContext from './context/modal';

const Login = lazy(() => import ('./pages/login'));
const SignUp = lazy(() => import ('./pages/signup'));
const NotFound = lazy(() => import ('./pages/not-found'));
const Dashboard = lazy(() => import ('./pages/dashboard'));
const Profile = lazy(() => import ('./pages/profile'));

export default function App() {
  const {user} = useAuthListener();
  const [open, setOpen] = useState(false);

  return (
    <UserContext.Provider value={{user}}>
      <ModalContext.Provider value={{open, setOpen}}>
        <BrowserRouter>
          <Suspense fallback={<ReactLoader />} >
            <Routes>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
              <Route 
                path={ROUTES.DASHBOARD} 
                element={
                  <ProtectedRoute user={user} path={ROUTES.DASHBOARD} exact>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ModalContext.Provider>
    </UserContext.Provider>
  );
}
