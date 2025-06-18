import HttpService from "./HttpService";
import Axios from "axios";

const baseURL="http://localhost:8091/OandMWorks/";

const submitURL=baseURL+"submitGos";

const UploadGOsService = {
    getGOsCirculars: (token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        HttpService.GosCircularsById(config)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },
    
    saveAllGOsCirculars: async (data,successCallback, errorCallback) => {
        let token=window.localStorage.getItem('KC_TOKEN');
        const config = {
            headers: {
                 Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        // const axiosInstance = axios.post({
        //     baseURL: baseUrl,

        // });
        await Axios.post(submitURL, data)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));

        
    },

    updateGOsCirculars: (id, data, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data", 
                Authorization: `Bearer ${token}`, 
            },


        };
        HttpService.updateGOsCirculars(id, data, config)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    // Delete a student
    deleteGOsCirculars: (id, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        HttpService.deleteGOsCirculars(id, config)
            .then(() => successCallback())
            .catch((error) => errorCallback(error));
    },

}

export default UploadGOsService