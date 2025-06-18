import HttpService from "./HttpService";


const TankFillingService = {
    getExistingDataForDateAndUnit: (unitId, successCallback, errorCallback) => {
        HttpService.setAuthToken();
        HttpService.getExistingDataForDateAndUnit(unitId)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    saveTankFillingStatus: async (data, successCallback, errorCallback) => {
        HttpService.setAuthToken();
        HttpService.saveTankFillingStatus(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },


    fetchTankFillingStatisticsReport: (data, successCallback, errorCallback) => {
        HttpService.setAuthToken();
        HttpService.getTankFillingStatisticsReport(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    fetchTankFillingStatusReport: (data, successCallback, errorCallback) => {
        HttpService.setAuthToken();
        HttpService.getTankFillingStatusReport(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    fetchTankDataByunitId: (data, successCallback, errorCallback) => {
        HttpService.setAuthToken();
        HttpService.getTankDataByunitId(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },
    // Delete a student
    deleteTankFillingStatus: (id, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        HttpService.deleteTankFillingStatus(id, config)
            .then(() => successCallback())
            .catch((error) => errorCallback(error));
    },

    officeWiseTanks: (data, type, successCallback, errorCallback) => {
        if (type === 'officeWisetanks') {
            HttpService.officeWiseTanks(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
        } else {
            HttpService.totalTanks(data)
                .then((response) => successCallback(response))
                .catch((error) => errorCallback(error));
        }

    },

    TotalTankList: (data, successCallback, errorCallback) => {
        HttpService.TotalTankList(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

 subOfficeWiseTanks: (data, successCallback, errorCallback) => {
        HttpService.subofficeWiseTanks(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },
    

}

export default TankFillingService