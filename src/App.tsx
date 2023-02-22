import RoutesApp from './routes/RoutesApp';
import { AuthProvider } from './context/AuthContex';

function App() {

  return (
    <AuthProvider>
      <RoutesApp />
    </AuthProvider>
  );
}

export default App;
