// pages/ProjetUrbainForm.jsx
import { useState } from 'react';
import MapPolygonInput from '../components/MapPolygonInput';
import axios from 'axios';

export default function ProjetUrbainForm() {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    budget: '',
    statut: 'planification',
    geometrie: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGeometryChange = (geometry) => {
    setFormData({ ...formData, geometrie: geometry });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/projets-urbains', formData);
    alert('Projet enregistré avec succès');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="input" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="textarea" />
      <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} className="input" />
      <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} className="input" />
      <input name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="Budget" className="input" />
      <select name="statut" value={formData.statut} onChange={handleChange} className="select">
        <option value="planification">Planification</option>
        <option value="en_cours">En cours</option>
        <option value="acheve">Achevé</option>
      </select>

      <div>
        <p className="mb-2 font-semibold">Délimiter la zone sur la carte :</p>
        <MapPolygonInput onChange={handleGeometryChange} />
      </div>

      <button type="submit" className="btn btn-primary">Enregistrer</button>
    </form>
  );
}
