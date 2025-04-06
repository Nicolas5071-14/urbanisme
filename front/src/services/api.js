import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export const getDemandes = () => api.get('/demandes-permis')
export const postDemande = (data) => api.post('/demandes-permis', data)
// Ajoute les autres appels : /permis, /paiements, etc.

export default api
