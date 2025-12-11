import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import { Layout } from '@/components/Layout/Layout';
import { ProfileSelect } from '@/pages/ProfileSelect/ProfileSelect';
import { ChildHome } from '@/pages/ChildHome/ChildHome';
import { Practice } from '@/pages/Practice/Practice';
import { Learn } from '@/pages/Learn/Learn';
import { ParentDashboard } from '@/pages/ParentDashboard/ParentDashboard';

function App() {
  return (
    <UserProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<ProfileSelect />} />
          <Route path="/child" element={<ChildHome />} />
          <Route path="/practice/:topic" element={<Practice />} />
          <Route path="/learn/:topic" element={<Learn />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </UserProvider>
  );
}

export default App;
