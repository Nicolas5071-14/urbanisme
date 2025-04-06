import { useEffect } from 'react';
import { useMap, FeatureGroup } from 'react-leaflet';
// import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

function DrawingControl({ onChange }) {
  const map = useMap();

  useEffect(() => {
    // Activer les outils de dessin
    map.pm.addControls({
      position: 'topright',
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircleMarker: false,
      rotateMode: false
    });

    // Gestionnaire pour les polygones créés
    const handleCreate = (e) => {
      const layer = e.layer;
      const geojson = layer.toGeoJSON();
      onChange(geojson.geometry);

      // Supprimer le layer après création
      map.pm.disableDraw();
      layer.remove();
    };

    map.on('pm:create', handleCreate);

    return () => {
      map.off('pm:create', handleCreate);
      map.pm.removeControls();
    };
  }, [map, onChange]);

  return null;
}

export default function MapPolygonInput({ onChange, initialGeometry }) {
  return (
    <div className="relative h-96 w-full rounded-md border border-gray-300">
      <MapContainer 
        center={[-18.8792, 47.5079]} // Centré sur Madagascar
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        pmIgnore={false} // Important pour Geoman
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <FeatureGroup>
          <DrawingControl onChange={onChange} />
        </FeatureGroup>

        {initialGeometry && (
          <GeoJSON 
            data={initialGeometry} 
            style={{ color: '#3388ff', weight: 2 }}
          />
        )}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-2 rounded shadow-md">
        <p className="text-sm text-gray-600">
          Cliquez sur l'icône <strong>polygone</strong> (🟦) pour dessiner
        </p>
      </div>
    </div>
  );
}