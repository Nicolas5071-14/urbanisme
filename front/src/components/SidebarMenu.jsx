import { NavLink } from 'react-router-dom';
import { 
  Map, 
  FileText, 
  Flag, 
  Building2 
} from 'lucide-react';

export default function SidebarMenu() {
  return (
    <div className="w-64 bg-urban-primary text-white p-4">
      <h2 className="text-xl font-bold mb-8">Urbanisme</h2>
      
      <nav className="space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-white text-urban-primary' : 'hover:bg-urban-secondary'}`
          }
        >
          <Map className="w-5 h-5 mr-3" />
          Tableau de bord
        </NavLink>
        
        <NavLink 
          to="/demandes-permis" 
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-white text-urban-primary' : 'hover:bg-urban-secondary'}`
          }
        >
          <FileText className="w-5 h-5 mr-3" />
          Demandes de permis
        </NavLink>
        
        <NavLink 
          to="/signalements" 
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-white text-urban-primary' : 'hover:bg-urban-secondary'}`
          }
        >
          <Flag className="w-5 h-5 mr-3" />
          Signalements
        </NavLink>
        
        <NavLink 
          to="/projets-urbains" 
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-white text-urban-primary' : 'hover:bg-urban-secondary'}`
          }
        >
          <Building2 className="w-5 h-5 mr-3" />
          Projets urbains
        </NavLink>
      </nav>
    </div>
  );
}