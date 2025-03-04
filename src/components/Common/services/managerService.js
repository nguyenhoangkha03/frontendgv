import axios from 'axios'

const API_URL = 'http://localhost:3333/api/manager'

export const getManagers = async () => {
    try {
        const response = await axios.get(`${API_URL}/list`)
        return response.data
    } catch(err){
        throw new Error('Error getting managers')
    }
}

export const addManager = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
      });
      return true
    } catch (error) {
      return false
    }
}

export const deleteManager = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      return true
    } catch (error) {
      return false
    }
}

export const updateManager = async (id, classs) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, classs)
      return true
    } catch (error) {
      return false
    }
}

export const getManagerById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
}