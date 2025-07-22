import axios from "axios";
import Cookies from "js-cookie";
import UserService from "./UserService";

// Base URL for the API

//const baseUrlHRMS = "http://localhost:8888/hrms/api/";
const baseUrlHRMS = "http://192.168.1.122:8072/hrms/api/";

//const baseUrl = "http://192.168.1.122:8072/oandm/OandMWorks/";
const baseUrl = "http://localhost:8098/OandMWorks/";

const baseUrlPMS = "http://192.168.1.122:8072/pmsapi/";

//const rtiAppnBaseUrl = "http://192.168.1.122:8072/oandm/oandm/rti/app/";
const rtiAppnBaseUrl = "http://localhost:8098/oandm/oandm/rti/app/";
//const rtiGBaseUrl = "http://192.168.1.122:8072/oandm/oandm/rti/prfmG/";
const rtiGBaseUrl = "http://localhost:8098/oandm/oandm/rti/prfmG/";

//const baseUrlMK = "http://192.168.1.122:8072/mkapi/mk/";
const baseUrlMK = "http://localhost:8090/mk/"

// URLs for various API endpoints
const loginUrl = baseUrl + "login";
const studentsUrl = baseUrl + "students";

const getWorksUrl = baseUrl + "O&MWorksTechnicalSanction";
const getWorkDetailsByworkIdUrl = baseUrl + "adminSanctionsByworkId";

const getWorkTypesURL = baseUrl + "getWorkTypeMst";

const saveAllTSURL = baseUrl + "submitTechnicalSanctions";
const getadminSanctionUrl = baseUrl + "submitTechnicalSanctions";
const getTechnicalSanctionsByworkId = baseUrl + "technicalSanctionsByworkId";
const getAgreementsByworkIdUrl = baseUrl + "AgreementsByworkId";
// const getAgmtAndBillDetailsByworkId = baseUrl + "agmtAndBillDetailsByworkId";
const saveAllAgreementsUrl = baseUrl + "submitAgreements";
// const saveAllBills = baseUrl + "submitBillDetails";

const saveAdminSanctionsURL = baseUrl + "submitAdminSanctions";

const getLiftsByProjectIdURL = baseUrl + "getLiftsByProjectId";

const getUserSmallLiftsURL = baseUrl + "getUserSmallLifts";

const getAuthorityListURL = baseUrl + "getAuthorityList";

//api urls from PMS
const getUserProjectsURL = baseUrlPMS + "project/getProjectList";

const getResByProjectsURL = baseUrlPMS + "irrinv/getReservoirsByProject";

const getDistrcitsURL = baseUrlPMS + "comp/getDistrictsList";

const getMandalsURL = baseUrlPMS + "comp/getMandalList";

const getVillagesURL = baseUrlPMS + "comp/getVillagesList";

//api urls from MK

const getMKDistrictsURL = baseUrlMK + "getDistricts";

const getMKMandalsURL = baseUrlMK + "getMandalsPerDistrict";

const getMKVillagesURL = baseUrlMK + "getVillagesPerMandal";

const getTanksURL = baseUrlMK + "getTanksPerVillage";

const getWorkTypeWiseAbsReportURL = baseUrl + "getAbsRepWorkTypeWiseFinyear";
const getAbsRepSanctionAuthorityWiseURL = baseUrl + "getAbsRepSanctionAuthorityWiseFinyear";
const getSanctionAuthorityOfcWiseReportURL = baseUrl + "getAbsRepSanctionAuthorityAndOfcWiseFinyear";
const getHOAWAbsReportURL = baseUrl + "getAbsRepHOAWiseFinyear";
const getUnitAndHOAWiseAbsReportURL = baseUrl + "getAbsRepUnitHOAWiseFinyear";
const getUnitWiseAbsReportURL = baseUrl + "getAbsRepUnitWiseFinyear";
const getGosCircularsByTypeUrl = baseUrl + "getGosCirculars";
const getWorkTypeAndHOAWiseAbsReportURL = baseUrl + "getAbsRepWorkTypeHOAWiseFinyear";
const getRtiRejSectionsUrl = rtiGBaseUrl + "rejSections";
const getSanctionAuthAndWorkTypeWiseAbsReportURL = baseUrl + "getAbsRepSanctionAuthWorkTypeWiseFinyear";
const getUnitWiseSCSTSdfAbsReportURL = baseUrl + "getAbsRepUnitWiseSCSTSdfFinyear";
const getDetailedAAReportURL = baseUrl + "O&MWorksAADetailedReport";
const getDetailedAAReportHoaURL = baseUrl + "O&MWorksHoaAADetailedReport";
const getDetailedAAReportSanctionURL = baseUrl + "O&MWorksSanctionAADetailedReport";
const getDetailedTSAgmtBillsReportURL = baseUrl + "O&MWorksTSAgmtBillsDetailedReport";
const getDetailedTSAgmtBillsReportHoaURL = baseUrl + "O&MWorksHoaTSAgmtBillsDetailedReport";
const getDetailedTSAgmtBillsReportSanctionURL = baseUrl + "O&MWorksSanctionTSAgmtBillsDetailedReport";
const getProjectAndUnitWiseReportURL = baseUrl + "getAbsReportProjectUnitWise";
const getYearWiseReportUrl = baseUrl + "getYearWiseReport";
// const getUserDetailsURL=baseUrlHRMS+"basicdata";
//const getUserDetailsURL = "http://192.168.1.157:8888/hrms/api/employee/profile/basicdata";

//const getUserDetailsURL="http://localhost:8888/hrms/api/employee/profile/basicdata";
const submitBillDetailsUrl = baseUrl + "submitBillDetails";
const getUserDetailsURL = "http://192.168.1.122:8072/hrms/api/employee/profile/basicdata";
const getUnitsURL = baseUrlHRMS + "masters/unit/list";

//const getUserDetailsURL="http://localhost:8888/hrms/api/employee/profile/basicdata";

const getCirclesURL = baseUrlHRMS + "masters/circle/list";
const getDivisionURL = baseUrlHRMS + "masters/division/list";
const getSubDivisionURL = baseUrlHRMS + "masters/subdivision/list";
const getUserAdminAmountByfinyearURL = baseUrl + "getAdminSanctionAmounts";
const getUnAssignedWorksURL = baseUrl + "getUnAssignedWorks";
const submitAssignedWorksURL = baseUrl + "submitAssignAdminSanction";
const getOfficeNamesURL = baseUrlHRMS + "masters/office/list";

const getWorkOverViewReportUrl = baseUrl + "getWorkOverViewReport";
const getProjectsListURL = baseUrlPMS + "project/getProjectsMap";
const getAgmtAndBillDetailsByworkIdURL = baseUrl + "agmtAndBillDetailsByworkId";
const getExistingDataForDateAndUnitUrl = baseUrlMK + "tanksCountPerUnitForTankFillingStatus";
const saveTankFillingStatusURL = baseUrlMK + "submitTankFillingStatus";

const getTankFillingStatisticsReportURL = baseUrlMK + "unitWiseTankFillingAbstractBetweenDates";
const getTankFillingStatusReportURL = baseUrlMK + "tankFillingAbstractStatusDate";
const getTankDataByunitIdURL = baseUrlMK + "jurisdictionBasedTanksForTankFillingStatus";

const officeWiseTanksURL = baseUrlMK + "officeWiseTanks";
const subofficeWiseTanksURL=baseUrlMK+"subofficeWiseTanks";
const viewDownloadFileURL = baseUrl + "viewFile";
const deleteByWorkIdURL = baseUrl + "deleteByWorkId";
// Create an axios instance

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
const axiosRTIG = axios.create({
  baseURL: rtiGBaseUrl,
  headers: { "Content-Type": "application/json" },
});

const axiosRTIC = axios.create({
  baseURL: rtiAppnBaseUrl,
  headers: { "Content-Type": "application/json" },
});
axiosInstance.interceptors.request.use(
  async (config) => {
    //const token = window.localStorage.getItem('KC_TOKEN');
    // const token =Cookies.get('token');y
    // const refreshToken =Cookies.get('refreshToken');
    const response = await UserService.getToken();

    const token = response;
    //console.log('token',response);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
axiosRTIG.interceptors.request.use(
  (config) => {
    // const token = window.localStorage.getItem('KC_TOKEN');

    const token = Cookies.get("token");
    const refreshToken = Cookies.get("refreshToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosRTIC.interceptors.request.use(
  (config) => {
    //const token = window.localStorage.getItem('KC_TOKEN');
    const token = Cookies.get("token");
    const refreshToken = Cookies.get("refreshToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
// Add authentication token (optional)

const setAuthToken = async () => {
  //  let token=window.localStorage.getItem('KC_TOKEN');
  //const token =Cookies.get('token');
  // const refreshToken =Cookies.get('refreshToken');

  const token = await UserService.getToken();

  //console.log("token in setAuth token in http service", token);
  if (token) {
    //console.log("KC_TOKENKC_TOKEN"+token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axiosRTIG.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axiosRTIC.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    delete axiosRTIG.defaults.headers.common["Authorization"];
    delete axiosRTIC.defaults.headers.common["Authorization"];
  }
};

// Login endpoint
const login = (payload) => axiosInstance.post(loginUrl, payload);
// get studnets
const getStudents = (config) => axiosInstance.get(studentsUrl, config);
// Generic POST request
const createStudent = (data, config) => {
  return axiosInstance.post("students", data, config);
};

// Generic PUT request
const updateStudent = (id, data, config) => {
  return axiosInstance.put(`students/${id}`, data, config);
};
const deleteStudent = (id, config) => axiosInstance.delete(`${studentsUrl}/${id}`, config);

const getYearWiseReport = () => axiosInstance.get(getYearWiseReportUrl);

const getWorkOverViewReport = () => axiosInstance.get(getWorkOverViewReportUrl);

const getWorks = (data) => axiosInstance.get(getWorksUrl, data);

const getWorkDetailsByWorkId = (workId) => axiosInstance.get(getWorkDetailsByworkIdUrl, workId);

const getGosCircularsByType = (uploadType) => axiosInstance.get(getGosCircularsByTypeUrl, uploadType);

const getAdminSanctions = () => axiosInstance.get(getadminSanctionUrl);

const saveAllTechnicalSanction = () => axiosInstance.post(saveAllTSURL);

const getTechnicalSanction = () => axiosInstance.get(getadminSanctionUrl);

const technicalSanctionsByworkId = (workId) => axiosInstance.get(getTechnicalSanctionsByworkId, workId);

const getAgreementsByworkId = (workId) => axiosInstance.get(getAgreementsByworkIdUrl, workId);

const agmtAndBillDetailsByworkId = (config) => axiosInstance.get(getAgmtAndBillDetailsByworkIdURL, config);

const submitAgreements = (config) => axiosInstance.post(saveAllAgreementsUrl, config);

const submitBillDetails = (config) => axiosInstance.post(submitBillDetailsUrl, config);

const getProjectAndUnitWiseReport = (config) => axiosInstance.get(getProjectAndUnitWiseReportURL, config);

const getSanctionAuthorityOfcWiseReport = (data) => axiosInstance.get(getSanctionAuthorityOfcWiseReportURL, data);

const getSanctionAuthorityAbsReport = (finyear) => axiosInstance.get(getAbsRepSanctionAuthorityWiseURL, finyear);

const getHOAWiseAbsReport = (finyear) => axiosInstance.get(getHOAWAbsReportURL, finyear);

const getUnitAndHOAWiseAbsReport = (finyear) => axiosInstance.get(getUnitAndHOAWiseAbsReportURL, finyear);

const getUnitWiseAbsReport = (finyear) => axiosInstance.get(getUnitWiseAbsReportURL, finyear);

const getWorkTypeAndHOAWiseAbsReport = (finyear) => axiosInstance.get(getWorkTypeAndHOAWiseAbsReportURL, finyear);

const getWorkTypeWiseAbsReport = (finyear) => axiosInstance.get(getWorkTypeWiseAbsReportURL, finyear);

const getUserDetails = (empId) => axiosInstance.get(getUserDetailsURL, empId);

const getSanctionAuthAndWorkTypeWiseAbsReport = (finyear) => axiosInstance.get(getSanctionAuthAndWorkTypeWiseAbsReportURL, finyear);

const getUnitWiseSCSTSdfAbsReport = (finyear) => axiosInstance.get(getUnitWiseSCSTSdfAbsReportURL, finyear);

const getDetailedAAReport = (data) => axiosInstance.get(getDetailedAAReportURL, data);

const getDetailedAAReportHoa = (data) => axiosInstance.get(getDetailedAAReportHoaURL, data);

const getDetailedAAReportSanction = (data) => axiosInstance.get(getDetailedAAReportSanctionURL, data);

const getDetailedTSAgmtBillsReport = (data) => axiosInstance.get(getDetailedTSAgmtBillsReportURL, data);

const getDetailedTSAgmtBillsReportHoa = (data) => axiosInstance.get(getDetailedTSAgmtBillsReportHoaURL, data);

const getDetailedTSAgmtBillsReportSanction = (data) => axiosInstance.get(getDetailedTSAgmtBillsReportSanctionURL, data);

const getUserAdminAmountByfinyear = (data) => axiosInstance.get(getUserAdminAmountByfinyearURL, data);
const getUnAssignedWorks = (data) => axiosInstance.get(getUnAssignedWorksURL, data);
const getCirclesByUnitId = (unitId) => axiosInstance.get(getCirclesURL, unitId);
const getDivisionsByCircleId = (data) => axiosInstance.get(getDivisionURL, data);
const getSubDivisionsByDivisionId = (data) => axiosInstance.get(getSubDivisionURL, data);
const submitAssignedWorks = (data) => axiosInstance.post(submitAssignedWorksURL, data);
const getOfficeNames = () => axiosInstance.get(getOfficeNamesURL);
const getUnits = () => axiosInstance.get(getUnitsURL);
//rtiG urls
const getRtiRejSections = () => {
  return axiosRTIG.get(getRtiRejSectionsUrl);
};

const createRtiGEntry = (data) => axiosRTIG.post(rtiGBaseUrl + "entry", data);
const updateRtiGEntry = (proGId, data) => axiosRTIG.put(rtiGBaseUrl + `updateById/${proGId}`, data);
const deleteRtiG = (id, username) => axiosRTIG.delete(rtiGBaseUrl + `deleteById/${id}`, { params: { username } });
const getRtiGallEntries = () => axiosRTIG.get(rtiGBaseUrl + "getAll");
const getRtiGEditList = (userDto) => axiosRTIG.post(rtiGBaseUrl + "getEditList", userDto);
const fetchRtiGYrQtrEEReport = (payload) => axiosRTIG.post(rtiGBaseUrl + "getGYrQtrEEReport", payload);
const fetchRtiPrfmGUnitConsolidated = (payload) => axiosRTIG.post(rtiGBaseUrl + "unitConsolidated", payload);
const fetchRtiPrfmGYrQtrDivisionConsolidatedReport = (payload) => axiosRTIG.post(rtiGBaseUrl + "divisionConsolidated", payload);
const fetchRtiPrfmGYrQtrCircleConsolidatedReport = (payload) => axiosRTIG.post(rtiGBaseUrl + "circleConsolidated", payload);

const getRtiCEditList = (userDto) => axiosRTIC.post(rtiAppnBaseUrl + "getEditList", userDto);
const createRtiCEntry = (formData) => axiosRTIC.post(rtiAppnBaseUrl + "entry", formData);
const getRtiCAllEntries = () => axiosRTIC.get(rtiAppnBaseUrl + "getAll");
const deleteRtiC = (id, username) => axiosRTIC.delete(rtiAppnBaseUrl + `deleteById/${id}`, { params: { username } });
const fetchRtiCYrQtrEEReport = (payload) => axiosRTIC.post(rtiAppnBaseUrl + "getCYrQtrEEReport", payload);
const fetchRtiCYrQtrConsolidatedReport = (payload) => axiosRTIC.post(rtiAppnBaseUrl + "unitConsolidated", payload);
const fetchRtiCYrQtrDivisionConsolidatedReport = (payload) => axiosRTIC.post(rtiAppnBaseUrl + "divisionConsolidated", payload);
const fetchRtiCYrQtrCircleConsolidatedReport = (payload) => axiosRTIC.post(rtiAppnBaseUrl + "circleConsolidated", payload);
const fetchRtiCYrQtrDashboardReport = (payload) => axiosRTIC.post(rtiAppnBaseUrl + "getCYrQtrDashboardReport", payload);

const updateRtiCEntry = (id, formData) => axiosRTIC.put(rtiAppnBaseUrl + `updateById/${id}`, formData);

const getUserProjects = (data) => axiosInstance.get(getUserProjectsURL, data);

const getResByProj = (id) => axiosInstance.get(`${getResByProjectsURL}/${id}`);

const getWrkTypes = () => axiosInstance.get(getWorkTypesURL);

const getMKDistricts = () => axiosInstance.get(getMKDistrictsURL);

const getMKMandals = (did) => axiosInstance.get(getMKMandalsURL, did);

const getMKVillages = (data) => axiosInstance.post(getMKVillagesURL, data);

const getTanks = (data) => axiosInstance.post(getTanksURL, data);

const getDistrcits = () => axiosInstance.get(getDistrcitsURL);

const getMandals = (dId) => axiosInstance.get(`${getMandalsURL}/${dId}`);

const getVillages = (mId) => axiosInstance.get(`${getVillagesURL}/${mId}`);

const getLifts = (projectId) => axiosInstance.get(`${getLiftsByProjectIdURL}/${projectId}`);

const getSmallLifts = (unitId) => axiosInstance.get(`${getUserSmallLiftsURL}/${unitId}`);

const submitAdminSanctions = (data) => axiosInstance.post(saveAdminSanctionsURL, data);

const getAuthorityList = () => axiosInstance.get(getAuthorityListURL);

const getProjectsList = () => axiosInstance.get(getProjectsListURL);

// tanks FIlling status
const getExistingDataForDateAndUnit = (unitId) => axiosInstance.get(getExistingDataForDateAndUnitUrl, unitId);
const saveTankFillingStatus = (config) => axiosInstance.post(saveTankFillingStatusURL, config);

const getTankFillingStatisticsReport = (config) => axiosInstance.get(getTankFillingStatisticsReportURL, config);
const getTankFillingStatusReport = (config) =>axiosInstance.get(getTankFillingStatusReportURL, config);
const getTankDataByunitId = (config) =>axiosInstance.post(getTankDataByunitIdURL,config);

const officeWiseTanks = (data) => axiosInstance.post(officeWiseTanksURL, data);

const subofficeWiseTanks = (data) => axiosInstance.get(subofficeWiseTanksURL, data);

const viewDownloadFile = (filepath) =>  axiosInstance.get(viewDownloadFileURL, {  params: { filepath }, responseType: 'blob' });

const deleteByWorkId = (workId) => axiosInstance.delete(deleteByWorkIdURL, workId);

// Export the methods
const HttpService = {
    setAuthToken,
    login,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getAdminSanctions,
    saveAllTechnicalSanction,
    getWorks,
    getWorkDetailsByWorkId,
    getSanctionAuthorityAbsReport,
    getUserDetails,
    getSanctionAuthorityOfcWiseReport,
    technicalSanctionsByworkId,
    getAgreementsByworkId,
    agmtAndBillDetailsByworkId,
    submitAgreements,
    submitBillDetails,
    getUserProjects,
    getWrkTypes,
    getMKDistricts,
    getMKMandals,
    getMKVillages,
    getTanks,
    submitAdminSanctions,
    getResByProj,
    getDistrcits,
    getMandals,
    getVillages,
    getLifts,
    getSmallLifts,
    getAuthorityList,
    getRtiRejSections,
     createRtiGEntry,
    updateRtiGEntry,
    deleteRtiG,
    getRtiGallEntries,
    createRtiCEntry,
    getRtiCAllEntries,
    deleteRtiC,
    updateRtiCEntry,
    getGosCircularsByType,
    getHOAWiseAbsReport,
    getUnitAndHOAWiseAbsReport,
    getUnitWiseAbsReport,
    getWorkTypeAndHOAWiseAbsReport,
    getWorkTypeWiseAbsReport,
    getSanctionAuthAndWorkTypeWiseAbsReport,
    getUnitWiseSCSTSdfAbsReport,
     getDetailedAAReport,
    getDetailedAAReportHoa,
    getDetailedAAReportSanction,
    getDetailedTSAgmtBillsReport,
    getDetailedTSAgmtBillsReportHoa,
    getDetailedTSAgmtBillsReportSanction,
    getUserAdminAmountByfinyear,
    getUnAssignedWorks,
    getUnits,
    getCirclesByUnitId,
    getDivisionsByCircleId,
    getSubDivisionsByDivisionId,
    submitAssignedWorks,
    getOfficeNames,
    getRtiCEditList,
    getRtiGEditList,
    fetchRtiCYrQtrEEReport,
    fetchRtiGYrQtrEEReport,
    fetchRtiCYrQtrConsolidatedReport,
    fetchRtiCYrQtrDivisionConsolidatedReport,
    fetchRtiCYrQtrCircleConsolidatedReport,
    fetchRtiPrfmGUnitConsolidated,
    fetchRtiPrfmGYrQtrDivisionConsolidatedReport,
    fetchRtiPrfmGYrQtrCircleConsolidatedReport,
    getYearWiseReport,
    getWorkOverViewReport,
    fetchRtiCYrQtrDashboardReport,
    getProjectsList,
    getProjectAndUnitWiseReport,
    getExistingDataForDateAndUnit,
    saveTankFillingStatus,
    getTankFillingStatisticsReport,
    getTankFillingStatusReport,
    getTankDataByunitId,
    officeWiseTanks,
    subofficeWiseTanks,
    viewDownloadFile,
    deleteByWorkId
};

export default HttpService;
