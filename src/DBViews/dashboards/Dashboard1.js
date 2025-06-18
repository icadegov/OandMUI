import React from "react";


import {
  AuthorityWiseReport,
  WorksOverview,
  YearWiseReport,
} from "./dashboard1-components";

const Dashboard1 = () => {
  // 2
  console.log("fetch");
//    const [reportData, setReportData] = useState();
//    const [reload, setReload] = useState(false);
//    const [errorData, setErrorData] = useState(null);
//    const [user, setUsers] = useState();                                            

//   const getToken = () => localStorage.getItem('KC_TOKEN');
//   const getUserDetails = () =>   localStorage.getItem('userDetails');
//   const token = getToken();
//    user = getUserDetails();
//   setUsers(user);
// alert("getAbsRepSanctionAuthorityWiseFinyear"+token);
// if (!token) {
// alert("not"+token);
// setErrorData('No authentication token found.');
// return;
// }

  return (
    <div className="container-fluid">
      <br/>
    <div className="row">
      {/* Empty space for the left side */}
      <div className="col-12 col-lg-2"></div>
  

      {/* Authority Wise Report Component */}
      <div className="col-12 col-lg-10 mb-4">
        <AuthorityWiseReport />
      </div>
    </div>
  
    <div className="row">
      {/* Empty space for the left side */}
      <div className="col-12 col-lg-2"></div>
  
      {/* year Wise Report */}
      <div className="col-12 col-lg-4 mb-4">
        <YearWiseReport />
      </div>
  
      {/* WorksOverview Component */}
      <div className="col-12 col-lg-6 mb-4">
        <WorksOverview />
      </div>
    </div>
  </div>
  
  );
};

export default Dashboard1;
