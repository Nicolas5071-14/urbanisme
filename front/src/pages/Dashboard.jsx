import { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';
import api from '../api/urbanismeApi';

// Icône du marqueur de position
const myIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Composant pour la localisation de l'utilisateur
function LocateUser() {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      // On ne fait plus de flyTo ici
    },
  });

  const locateUser = () => {
    map.locate({
      setView: false, // Important pour ne pas centrer la vue
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  };

  return (
    <div className="leaflet-top leaflet-right">
      <button 
        onClick={locateUser}
        className="leaflet-bar leaflet-control bg-white p-2 m-2 rounded shadow cursor-pointer flex items-center justify-center"
        title="Localiser ma position"
      >
        <LocateFixed className="w-4 h-4" />
      </button>
      {position && (
        <Marker position={position} icon={myIcon}>
          <Popup>Votre position actuelle</Popup>
        </Marker>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, geoRes] = await Promise.all([
          api.get('/projets-urbains'),
          api.get('/geometries')
        ]);
        setProjects(projectsRes.data);
        setGeoData(geoRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-urban-primary">Tableau de Bord Urbanisme</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 map-container">
          <MapContainer center={[-18.8792, 47.5079]} zoom={13} style={{ height: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geoData && <GeoJSON data={geoData} />}
            <LocateUser />
          </MapContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Projets récents</h2>
          <ul className="space-y-3">
            {projects.map(project => (
              <li key={project.id} className="p-3 hover:bg-gray-50 rounded">
                <h3 className="font-medium">{project.nom}</h3>
                <p className="text-sm text-gray-600">{project.statut}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Demandes de permis" value="24" trend="up" />
        <StatCard title="Signalements" value="15" trend="down" />
        <StatCard title="Projets actifs" value="8" trend="neutral" />
      </div>
    </div>
  );
}

function StatCard({ title, value, trend }) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <div className="flex items-end justify-between mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`${trendColors[trend]}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </span>
      </div>
    </div>
  );
}