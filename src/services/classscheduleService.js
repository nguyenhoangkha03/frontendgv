import axios from 'axios'

const API_URL = 'http://localhost:3333/api/schedule'

export const getClassSchedule = async () => {
    try {
        const response = await axios.get(`${API_URL}/list`)
        return response.data
    } catch(err){
        throw new Error('Error getting classesSchedule')
    }
}


export const getClassScheduleById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/class/date/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
}

export const getClassScheduleByClassIdAndDate = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/class/date/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
}