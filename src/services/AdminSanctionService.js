import HttpService from "./HttpService";

import Cookies from 'js-cookie';
import Axios from "axios";

//const submitURL="http://192.168.1.122:8072/oandm/OandMWorks/submitAdminSanctions";

const submitURL = "http://localhost:8098/OandMWorks/submitAdminSanctions";


const AdminSanctionService = {

    getWorks: ( data,successCallback, errorCallback) => {

               //HttpService.setAuthToken();
                HttpService.getWorks(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    getWorkDetailsByWorkId: ( workId,successCallback, errorCallback) => {
      
        //HttpService.setAuthToken();
            HttpService.getWorkDetailsByWorkId(workId)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    getworkType:(successCallback,errorCallback)=>{
        //HttpService.setAuthToken();
HttpService.getWrkTypes()
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
    },

    submitAdminSanctions:async(data,successCallback,errorCallback)=>{        
        //let token=UserService.settoken();
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
    },
    getLifts: (projectId,successCallback, errorCallback) => {
        //HttpService.setAuthToken();
        HttpService.getLifts(projectId)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
    },
    getSmallLifts: (unitId,successCallback, errorCallback) => {
        //HttpService.setAuthToken();
        HttpService.getSmallLifts(unitId)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
    },
getAuthorityList: (successCallback, errorCallback) => {
    //HttpService.setAuthToken();
       HttpService.getAuthorityList()
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
},
getUserAdminAmountByfinyear: (data,successCallback, errorCallback) => {
    //HttpService.setAuthToken();
    HttpService.getUserAdminAmountByfinyear(data)
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
},
getUnAssignedWorks: (data,successCallback, errorCallback) => {
    //HttpService.setAuthToken();
    //UserService.settoken();
    HttpService.getUnAssignedWorks(data)
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
},

submiAssignedWorks: (data,successCallback, errorCallback) => {
    //HttpService.setAuthToken();
    HttpService.submitAssignedWorks(data)
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
},
getProjectsList: (successCallback, errorCallback) => {
    HttpService.setAuthToken();
       HttpService.getProjectsList()
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
},
}

export default AdminSanctionService