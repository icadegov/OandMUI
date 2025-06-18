import HttpService from "./HttpService";

const RTIPrfmCService = {
    
    createRtiCEntry: (formData, successCallback, errorCallback) => {
        HttpService.createRtiCEntry(formData)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    
 submitRtiCEntry : (rti, cleanedValues, successCallback, errorCallback) => {
    const formDataWithAppnId = { 
        ...cleanedValues, 
        applicationId: rti.applicationId, 
        deleteFlag: cleanedValues.deleteFlag ?? false,
        isLatest: rti.isLatest ?? true,
        createDate: rti.createDate

     };
     


    const apiCall = rti.applicationId 
        ? HttpService.updateRtiCEntry(rti.applicationId, formDataWithAppnId) // Update case
        : HttpService.createRtiCEntry(cleanedValues); // Create case

    apiCall
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
},


    // Update existing RTI Proforma G entry (PUT request)
    updateRtiCEntry: (applicationId, values, successCallback, errorCallback) => {
        HttpService.updateRtiCEntry(applicationId, values)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },
    

    // Delete a student
    deleteRtiCEntry: (id, username, successCallback, errorCallback) => {
        HttpService.deleteRtiC(id,username)
            .then((response) => {
                console.log("Service Response:", response); // Debugging
                
                successCallback(response);
            })
            .catch((error) => {
            console.error("Service Error:", error);
            errorCallback(error);
        });
    },

// In HttpService.js


fetchRtiCData: (successCallback, errorCallback) => {
        HttpService.getRtiCAllEntries()
            .then((response) => successCallback(response.data.data||[])) // Pass only relevant data
            .catch((error) => errorCallback(error));
    },

    
    getRtiCEditList: (userDto, successCallback, errorCallback) => {
        HttpService.getRtiCEditList(userDto)
            .then((response) => successCallback(response.data.data||[]))
            .catch((error) => errorCallback(error));
    },

    
    fetchRtiCYrQtrEEReport: (payload, successCallback, errorCallback) => {
         HttpService.fetchRtiCYrQtrEEReport(payload)       
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    },
    fetchRtiCYrQtrDashboardReport: (payload, successCallback, errorCallback) => {
         HttpService.fetchRtiCYrQtrDashboardReport(payload)       
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    },

     fetchRtiCYrQtrConsolidatedReport: (payload, successCallback, errorCallback) => {
         HttpService.fetchRtiCYrQtrConsolidatedReport(payload)       
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    },
     

     fetchRtiCYrQtrDivisionConsolidatedReport: (payload, successCallback, errorCallback) => {
         HttpService.fetchRtiCYrQtrDivisionConsolidatedReport(payload)       
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    },
     
     fetchRtiCYrQtrCircleConsolidatedReport: (payload, successCallback, errorCallback) => {
         HttpService.fetchRtiCYrQtrCircleConsolidatedReport(payload)       
            .then((response) => successCallback(response.data.data || []))
            .catch((error) => errorCallback(error));
    },

};

export default RTIPrfmCService;
