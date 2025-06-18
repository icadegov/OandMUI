
import HttpService from './HttpService';
import UserService from './UserService';

const ReportsService = {
 
    fetchSanctionAuthorityAndOfcWise: (finyear ,successCallback, errorCallback) => {
       
//UserService.settoken();
//HttpService.setAuthToken();
            HttpService.getSanctionAuthorityOfcWiseReport(finyear)
            .then((response) => successCallback(response))
            .catch((error) => errorCallback(error));
    },

    fetchSanctionAuthorityAndOfficeWise: (unitId, circleId, divisionId, subDivisionId ,finyear,approvedById,successCallback, errorCallback) => {
       
       // UserService.settoken();
        //HttpService.setAuthToken();
                    HttpService.getSanctionAuthorityOfcWiseReport(unitId,circleId, divisionId, subDivisionId ,finyear,approvedById)
                    .then((response) => successCallback(response))
                    .catch((error) => errorCallback(error));
            },
}

export default ReportsService