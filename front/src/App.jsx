import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SidebarMenu from './components/SidebarMenu';
import Dashboard from './pages/Dashboard';
// import DemandePermisForm from './pages/DemandePermisForm';
// import SignalementForm from './pages/SignalementForm';
// import ProjetUrbainForm from './pages/ProjetUrbainForm';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <SidebarMenu />
        
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/demandes-permis" element={<DemandePermisForm />} />
            <Route path="/signalements" element={<SignalementForm />} />
            <Route path="/projets-urbains" element={<ProjetUrbainForm />} /> */}
          </Routes>
        </div>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;