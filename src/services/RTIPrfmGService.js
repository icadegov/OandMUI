import HttpService from "./HttpService";

const RTIPrfmGService = {
    // Fetch students
    fetchRtiRejSections: ( successCallback, errorCallback) => {
       

        HttpService.getRtiRejSections()
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },
// code can be optimised instead of using callbacks can use async await
    // fetchRtiRejSections: async () => {
    //     try {
    //         const response = await HttpService.getRtiRejSections();
    //         return response.data; // Assuming API response has { data: [...] }
    //     } catch (error) {
    //         console.error("Error fetching RTI Rejection sections:", error);
    //         throw error; // Propagate the error
    //     }
    // },



    // Submit RTI Proforma G entry (POST request)
    submitRtiGEntry: (payload, successCallback, errorCallback) => {
        HttpService.createRtiGEntry(payload)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    

   // Update existing RTI Proforma G entry (PUT request)
    updateRtiGEntry: (proGId, payload, successCallback, errorCallback) => {
        HttpService.updateRtiGEntry(proGId, payload)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },
    
    

    // Delete a student
    deleteRtiG: (id, username, successCallback, errorCallback) => {
        HttpService.deleteRtiG(id,username)
            .then((response) => {
                console.log("Service Response:", response); // Debugging
                successCallback(response);
            })
            .catch((error) => {
            console.error("Service Error:", error);
            errorCallback(error);
        });
    },


fetchRtiGData: (successCallback, errorCallback) => {
        HttpService.getRtiGallEntries()
            .then((response) => successCallback(response.data.data||[])) // Pass only relevant data
            .catch((error) => errorCallback(error));
    },

        fetchRtiGYrQtrEEReport: (payload, successCallback, errorCallback) => {
         HttpService.fetchRtiGYrQtrEEReport(payload)       
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    },


    getRtiGEditList: (userDto, successCallback, errorCallback) => {
        HttpService.getRtiGEditList(userDto)
            .then((response) => successCallback(response.data.data||[]))
            .catch((error) => errorCallback(error));
    },

    fetchRtiPrfmGUnitConsolidated: (payload, successCallback, errorCallback) => {
        HttpService.fetchRtiPrfmGUnitConsolidated(payload)
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    },

    
     fetchRtiPrfmGYrQtrDivisionConsolidatedReport: (payload, successCallback, errorCallback) => {
         HttpService.fetchRtiPrfmGYrQtrDivisionConsolidatedReport(payload)       
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    },
     
     fetchRtiPrfmGYrQtrCircleConsolidatedReport: (payload, successCallback, errorCallback) => {
         HttpService.fetchRtiPrfmGYrQtrCircleConsolidatedReport(payload)       
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    }

};

export default RTIPrfmGService;
