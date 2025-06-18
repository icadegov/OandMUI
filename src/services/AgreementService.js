import HttpService from "./HttpService";
import UserService from './UserService';

//const baseURL="http://localhost:8098/OandMWorks/";

//const submitURL=baseURL+"submitTechnicalSanctions";

const AgreementService = {

    getAgreementsByworkId: (workId, successCallback, errorCallback) => {
         UserService.settoken();
        HttpService.getAgreementsByworkId(workId)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },
    
    saveAllAgreements: async (data, successCallback, errorCallback) => {
        const config = {
            headers: {
                // Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };

        // const axiosInstance = axios.post({
        //     baseURL: baseUrl,

        // });
      //  await Axios.post(submitURL, data)
      //  .then((response) => successCallback(response))
      //  .catch((error) => errorCallback(error));

         HttpService.submitAgreements(data, config)
             .then((response) => successCallback(response))
             .catch((error) => errorCallback(error));
    },

    updateAgreements: (id, data, token, successCallback, errorCallback) => {
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
    deleteAgreements: (id, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        HttpService.deleteStudent(id, config)
            .then(() => successCallback())
            .catch((error) => errorCallback(error));
    },

    fetchAgmtAndBillDetailsByworkId : (config,successCallback, errorCallback) => {

        HttpService.agmtAndBillDetailsByworkId(config)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
        },


}

export default AgreementService