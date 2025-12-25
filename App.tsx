import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/ui/Layout';
import Login from './pages/Login';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <AppRoutes />
      </Layout>
    </Router>
  );
};

export default App;