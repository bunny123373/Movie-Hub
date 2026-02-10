// Test script to verify series API call
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testSeriesAPI = async () => {
  try {
    console.log('Testing series API call...');
    const response = await axios.get(`${API_URL}/movies/series?limit=8`);
    console.log('API Response:', response.data);
    console.log('Series array:', response.data.series);
    console.log('Series length:', response.data.series.length);
    
    if (response.data.series.length > 0) {
      console.log('First series:', response.data.series[0]);
    }
  } catch (error) {
    console.error('API Error:', error.message);
    console.error('Full error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};

testSeriesAPI();