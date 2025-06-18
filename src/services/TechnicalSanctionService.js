import HttpService from "./HttpService";
import Axios from "axios";
import Cookies from 'js-cookie';
import UserService from './UserService';
const baseURL="http://192.168.1.122:8072/oandm/OandMWorks/";

const submitURL=baseURL+"submitTechnicalSanctions";

const TechnicalSanctionService = {
    getTechnicalSanction: (successCallback, errorCallback) => {
        // const config = {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // };
        UserService.settoken();
        HttpService.getAdminSanctions()
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    technicalSanctionsByworkId : (workId,successCallback, errorCallback) => {
        UserService.settoken();
        HttpService.technicalSanctionsByworkId(workId)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
    },

    saveAllTechnicalSanction: async (data, successCallback, errorCallback) => {
        //let token=window.localStorage.getItem('KC_TOKEN');
let token=Cookies.get('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };

        await Axios.post(submitURL, data,config)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));

        // HttpService.saveAllTechnicalSanction(data, config)
        //     .then((response) => successCallback(response))
        //     .catch((error) => errorCallback(error));
    },

    updateTechnicalSanction: (id, data, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },


        };
        HttpService.updateStudent(id, data, config)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    // Delete a student
    deleteTechnicalSanction: (id, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        HttpService.deleteStudent(id, config)
            .then(() => successCallback())
            .catch((error) => errorCallback(error));
    },

}

export default TechnicalSanctionService