import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const analyzeProject = async (githubUrl) => {
    const response = await axios.post(`${API_BASE_URL}/projects/analyze`, {
        github_url: githubUrl
    });
    return response.data;
};

export const getProjectDetails = async (projectId) => {
    const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`);
    return response.data;
};
