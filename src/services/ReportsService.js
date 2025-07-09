import HttpService from './HttpService';


const ReportsService = {
 
fetchSanctionAuthorityWise: (finyear ,successCallback, errorCallback) => {

       // HttpService.setAuthToken();
            HttpService.getSanctionAuthorityAbsReport(finyear)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

fetchYearWiseReport: (successCallback, errorCallback) => {
  //  HttpService.setAuthToken();
     //   UserService.settoken();
              HttpService.getYearWiseReport()
              .then((response) => successCallback(response))
              .catch((error) => errorCallback(error));
      },

fetchWorkOverViewReport:  (data, successCallback, errorCallback) => {
   // HttpService.setAuthToken();
   //     UserService.settoken();
              HttpService.getWorkOverViewReport()
              .then((response) => successCallback(response))
              .catch((error) => errorCallback(error));
      },

fetchhoaWise: (finyear ,successCallback, errorCallback) => {
       
       // HttpService.setAuthToken();
             HttpService.getHOAWiseAbsReport(finyear)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
            },
            
fetchUnitWise: (finyear ,successCallback, errorCallback) => {
       
               
                     HttpService.getUnitWiseAbsReport(finyear)
                    .then((response) => successCallback(response))
                    .catch((error) => errorCallback(error));
                    },

 fetchUnitAndHoaWise: (finyear ,successCallback, errorCallback) => {
       
   
            HttpService.getUnitAndHOAWiseAbsReport(finyear)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
                    },

fetchWorkTypeAndHOAWise: (finyear ,successCallback, errorCallback) => {
       
   
        HttpService.getWorkTypeAndHOAWiseAbsReport(finyear)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
                },

fetchSanctionAuthAndWorkTypeWise: (finyear,successCallback, errorCallback) => {
  
        HttpService.getSanctionAuthAndWorkTypeWiseAbsReport(finyear)
        .then((response) => successCallback(response))
        .then((error) => errorCallback(error));
                },         

fetchWorkTypeWise: (finyear ,successCallback, errorCallback) => {
       
   
        HttpService.getWorkTypeWiseAbsReport(finyear)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
                                },
    
fetchUnitWiseSCSTSdf : (finyear ,successCallback, errorCallback) => {
       
   
        HttpService.getUnitWiseSCSTSdfAbsReport(finyear)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
                                },
               
 fetchSanctionAuthorityAndOfficeWise: (data,successCallback, errorCallback) => {
       HttpService.getSanctionAuthorityOfcWiseReport(data)
                    .then((response) => successCallback(response))
                    .catch((error) => errorCallback(error));
                   
            },

fetchDataByWorkId : (workId,successCallback, errorCallback) => {
               HttpService.getWorkDetailsByWorkId(workId)
                .then((response) => successCallback(response))
                .catch((error) => errorCallback(error));
           
            },

fetchGosCirculars : (uploadType, successCallback, errorCallback) => {
               // alert("ReportService UploadType :"+uploadType);
                HttpService.getGosCircularsByType(uploadType)
                .then((response) => successCallback(response))
                .catch((error) => errorCallback(error));
            },

                        
 getDetailedAAReport: ( data,successCallback, errorCallback) => {
      
               
               HttpService.getDetailedAAReport(data)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
 },

 getDetailedAAReportHoa: (data,successCallback, errorCallback) => {
      
   
   HttpService.getDetailedAAReportHoa(data)
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
},

getDetailedAAReportSanction: (data,successCallback, errorCallback) => {
   
   HttpService.getDetailedAAReportSanction(data)
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
},

getDetailedTSAgmtBillsReportSanction: (data,successCallback, errorCallback) => {
      
  
   HttpService.getDetailedTSAgmtBillsReportSanction(data)
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
},

getDetailedTSAgmtBillsReportHoa: ( data,successCallback, errorCallback) => {
      
   
   HttpService.getDetailedTSAgmtBillsReportHoa(data)
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
},

getDetailedTSAgmtBillsReport: (data,successCallback, errorCallback) => {

HttpService.getDetailedTSAgmtBillsReport(data)
.then((response) => successCallback(response))
.catch((error) => errorCallback(error));
},

fetchProjectAndUnitWise : (config,successCallback, errorCallback) => {

        HttpService.getProjectAndUnitWiseReport(config)
        .then((response) => successCallback(response))
        .catch((error) => errorCallback(error));
        },


viewDownloadFile: async(filepath,successCallback,errorCallback) => {
        HttpService.viewDownloadFile(filepath)
      .then((response) => successCallback(response))
      .catch((error) => errorCallback(error));
  },

}

export default ReportsService