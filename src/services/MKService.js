
import HttpService from "./HttpService";

const MKServies = {
    
    getdistricts: (successCallback, errorCallback) => {
        HttpService.getMKDistricts()
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
    },

    getMandals: (districtId,successCallback, errorCallback) => {
        HttpService.getMKMandals(districtId)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
    },

getVillages: (data,successCallback, errorCallback) => {
        HttpService.getMKVillages(data)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
    },

    getTanks: (data,successCallback, errorCallback) => {
        HttpService.getTanks(data)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
    }   
}

export default MKServies