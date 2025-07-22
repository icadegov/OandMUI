import HttpService from "./HttpService";


const BillService = {
    getBillDetails: (token, successCallback, errorCallback) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        HttpService.getBillDetails(config)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },
    
   submitBillDetails: async (data, successCallback, errorCallback) => {
   // console.log("BillService"+JSON.stringify(data));
        const config = {
            headers: {
                // Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };
        
        HttpService.submitBillDetails(data, config)
             .then((response) => successCallback(response))
             .catch((error) => errorCallback(error));
    },

    updateBillDetails: (id, data, token, successCallback, errorCallback) => {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data", 
                Authorization: `Bearer ${token}`, 
            },


        };
        HttpService.updateBillDetails(id, data, config)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    
}

export default BillService