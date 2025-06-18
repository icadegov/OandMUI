
import HttpService from "./HttpService";


const PMSService = {

    getUserProjects: ( data,successCallback, errorCallback) => {
                HttpService.getUserProjects(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    getReservoirByProject: (id, successCallback, errorCallback) => {
        HttpService.getResByProj(id)
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
},

getDistrcits: (successCallback, errorCallback) => {
    HttpService.getDistrcits()
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
},

getMandals: (did,successCallback, errorCallback) => {

    //console.log("didDid",did);
    HttpService.getMandals(did)
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
},

getVillages: (mid,successCallback, errorCallback) => {
    HttpService.getVillages(mid)
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
},
    
}

export default PMSService;