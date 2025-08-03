import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
console.log("Base API URL:", process.env.REACT_APP_API_URL);


export const AddEmployeeAPI = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/employee/create`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error inserting employee:", error);
    throw error;
  }
}

export const GetAllEmployeesAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/employee/getall`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

export const UpdateEmployeeDetailsAPI = async (employee) => {
  try {
    const response = await axios.put(`${API_URL}/employee/update`, employee);
    return response.data;
  } catch (error  ) {
    console.error("Error updating employee:", error);
    throw error;
  }
}

export const DeleteEmployeeAPI = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/employee/delete/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};


