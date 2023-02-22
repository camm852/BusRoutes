import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotFound from '../components/NotFound';
import Redirect from '../components/Redirect';
import { useAuth } from '../context/AuthContex';
import GestionRoutes from '../views/GestionRoutes';
import Home from '../views/Home';
import Login from '../views/Login';

function RequiredAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (user.name === '' && user.email === '') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function IsAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (user.name !== '' && user.email !== '') {
    return <Navigate to="/routes" replace />;
  }
  return children;
}

export default function RoutesApp() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <IsAuth>
              <Login />
            </IsAuth>
          }
        />
        <Route
          path="/routes"
          element={
            <RequiredAuth>
              <Redirect url="/routes/1" />
            </RequiredAuth>
          }
        />
        <Route
          path="/routes/:page"
          element={
            <RequiredAuth>
              <GestionRoutes />
            </RequiredAuth>
          }
        />
      </Routes>
    </Router>
  );
}
