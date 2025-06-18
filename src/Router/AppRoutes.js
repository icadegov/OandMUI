import React from "react";
import { Route, Routes } from "react-router-dom";

import TechnicalSanctionForm from "../components/Entry/TechnicalSanctionForm";
import AdminSanctionForm from "../components/Entry/AdminSanctionForm";
import { SanctionAuthorityWise } from "../components/Reports/SanctionAuthorityWise";
import { HOAWise } from "../components/Reports/HOAWise";
import { UnitAndHOAWise } from "../components/Reports/UnitAndHOAWise";
import { UnitWise } from "../components/Reports/UnitWise";
import { ProjectAndUnitWise } from "../components/Reports/ProjectAndUnitWise";
import { WorkTypeAndHOAWise } from "../components/Reports/WorkTypeAndHOAWise";
import { SanctionAuthAndWorkTypeWise } from "../components/Reports/SanctionAuthAndWorkTypeWise";
import { WorkTypeWise } from "../components/Reports/WorkTypeWise";
import { UnitWiseSCSTSdf } from "../components/Reports/UnitWiseSCSTSdf";
import DetailedAAReport from "../components/Reports/DetailedAAReport";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminSanctionEdit from "../components/Edit/AdminSanctionEdit";
import SubmitASEdit from "../components/Edit/SubmitASEdit";
import TankFillingStatusForm from "../components/Entry/TankFillingStatusForm";
import { TankFillingStatusStatisticsReport } from "../components/Reports/TankFillingStatusStatisticsReport";
import { TankFillingStatusReport } from "../components/Reports/TankFillingStatusReport";
import AgreementsForm from "../components/Entry/AgreementsForm";
import RtiProformaGEntryOld from "../RTI/RTIEntry/RtiProformaGEntryOld";
import UploadGos from "../components/Entry/UploadGos";
import CircularsReport from "../components/Reports/CircularsReport";

import AssignAdminSanction from "../components/Entry/AssignAdminSanctionForm";
import BillsForm from "../components/Entry/BillsForm";
import DetailedTSAgmtBillsReport from "../components/Reports/DetailedTSAgmtBillsReport";
import TotalTanksList from "../components/Reports/TotalTanksList";

import RTIApplication from "../RTI/RTIEntry/RTIApplication";
import RTIApplicationEEReport from "../RTI/RTIReports/RTIApplicationEEReport";
import RtiproformaGDataReport from "../RTI/RTIReports/RtiproformaGDataReport";
import RtiproformaGConsolidatedReport from "../RTI/RTIReports/RtiproformaGConsolidatedReport";
import RtiproformaGEdit from "../RTI/RTIEntry/RtiproformaGEdit";
import RTIApplicationEdit from "../RTI/RTIEntry/RTIApplicationEdit";
import RtiAppConsolidatedReport from "../RTI/RTIReports/RtiAppConsolidatedReport";
import RtiAppDivisionConsolidatedReport from "../RTI/RTIReports/RtiAppDivisionConsolidatedReport";
import RtiAppCircleConsolidatedReport from "../RTI/RTIReports/RtiAppCircleConsolidatedReport";
import RtiproformaGCircleConsolidatedReport from "../RTI/RTIReports/RtiproformaGCircleConsolidatedReport";
import RtiproformaGDivisionConsolidatedReport from "../RTI/RTIReports/RtiproformaGDivisionConsolidatedReport";

import Dashboard1 from "../DBViews/dashboards/Dashboard1";
import RTIDasboard from "../RTI/RTIComponents/RTIDashboard";

import KeyCloakLogin from "../components/KeyCloak/KeyCloakLogin";

export default function AppRoutes() {
  // const theme = createTheme();

  return (
    <>
      {/* <ThemeProvider theme={theme}> */}
      <Routes>
        <Route path="/oandmdashboard" element={<Dashboard1></Dashboard1>} />
        {/* <Route path= '/' element = {<Dashboard1></Dashboard1>} />     */}

        {/* <Route path= '/oandmdashboard' element = {<UploadGos></UploadGos>} />  */}
        {/* <Route path='/' element={<KeyCloakLogin />} />  */}
        {/* <Route path= '/techSanctionForm' element = {<TechnicalSanctionForm></TechnicalSanctionForm>}></Route>  */}
        {/* <Route path='/CEAbstractReport' element={<ProtectedRoute><SanctionAuthorityWise></SanctionAuthorityWise></ProtectedRoute>} /> */}

        <Route path="/O&MWorksAADetailedReport" element={<DetailedAAReport />} />
        <Route path="/O&MWorksTSDetailedReport" element={<DetailedTSAgmtBillsReport />} />

        <Route
          path="/CEAbstractReport"
          element={
            <ProtectedRoute>
              <SanctionAuthorityWise></SanctionAuthorityWise>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CEAbstractReportHoaWise"
          element={
            <ProtectedRoute>
              <HOAWise></HOAWise>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CEAbsReportUnitHoaWise"
          element={
            <ProtectedRoute>
              <UnitAndHOAWise></UnitAndHOAWise>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CEAbsReportUnitWise"
          element={
            <ProtectedRoute>
              <UnitWise></UnitWise>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CEAbsReportHoaWorkTypeWise"
          element={
            <ProtectedRoute>
              <WorkTypeAndHOAWise></WorkTypeAndHOAWise>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CEAbsReportProjectUnitWise"
          element={
            <ProtectedRoute>
              <ProjectAndUnitWise></ProjectAndUnitWise>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CEAbsReportWorkTypeWise"
          element={
            <ProtectedRoute>
              <WorkTypeWise></WorkTypeWise>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CEAbsReportSancWorkTypeWise"
          element={
            <ProtectedRoute>
              <SanctionAuthAndWorkTypeWise></SanctionAuthAndWorkTypeWise>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CEAbsReportSCSTUnitWise"
          element={
            <ProtectedRoute>
              <UnitWiseSCSTSdf></UnitWiseSCSTSdf>
            </ProtectedRoute>
          }
        />
        <Route path="/O&MWorksAADetailedReport" element={<DetailedAAReport />} />
        <Route
          path="/techSanctionForm"
          element={
            <ProtectedRoute>
              <TechnicalSanctionForm></TechnicalSanctionForm>
            </ProtectedRoute>
          }
        />
        <Route path="/adminSanctionForm" element={<AdminSanctionForm></AdminSanctionForm>} />
        <Route path="/adminSancEdit" element={<AdminSanctionEdit />}></Route>

        <Route path="/submitASEdit" element={<SubmitASEdit />} />
        <Route
          path="/rtiapp"
          element={
            <ProtectedRoute>
              <RTIApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtiproformaGentry"
          element={
            <ProtectedRoute>
              <RtiProformaGEntryOld />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtiappEdit"
          element={
            <ProtectedRoute>
              <RTIApplicationEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtiappEEreport"
          element={
            <ProtectedRoute>
              <RTIApplicationEEReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtiproformaGEdit"
          element={
            <ProtectedRoute>
              <RtiproformaGEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtiproformaGDataReport"
          element={
            <ProtectedRoute>
              <RtiproformaGDataReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtiAppConsolidatedReport"
          element={
            <ProtectedRoute>
              <RtiAppConsolidatedReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/circle-proforma"
          element={
            <ProtectedRoute>
              <RtiAppCircleConsolidatedReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/division-proforma"
          element={
            <ProtectedRoute>
              <RtiAppDivisionConsolidatedReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtiprfmGConsolidatedReport"
          element={
            <ProtectedRoute>
              <RtiproformaGConsolidatedReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/circle-proformaG"
          element={
            <ProtectedRoute>
              <RtiproformaGCircleConsolidatedReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/division-proformaG"
          element={
            <ProtectedRoute>
              <RtiproformaGDivisionConsolidatedReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtidashboard"
          element={
            <ProtectedRoute>
              <RTIDasboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rtiprfmGCircleConsolidatedReport"
          element={
            <ProtectedRoute>
              <RtiproformaGConsolidatedReport />
            </ProtectedRoute>
          }
        />
        <Route path="/uploadGos" element={<UploadGos />} />
        <Route path="/circularsReport" element={<CircularsReport />} />
        <Route
          path="/AssignWork"
          element={
            <ProtectedRoute>
              <AssignAdminSanction></AssignAdminSanction>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/agreementForm"
          element={
            <ProtectedRoute>
              <AgreementsForm></AgreementsForm>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/billsForm"
          element={
            <ProtectedRoute>
              <BillsForm></BillsForm>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/tankFillingEntry"
          element={
            <ProtectedRoute>
              <TankFillingStatusForm></TankFillingStatusForm>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="/tankFillingStatisticsReport"
          element={
            <ProtectedRoute>
              <TankFillingStatusStatisticsReport></TankFillingStatusStatisticsReport>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/tankFillingStatusReport"
          element={
            <ProtectedRoute>
              <TankFillingStatusReport></TankFillingStatusReport>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/totalTanksListForTankFilling"
          element={
            <ProtectedRoute>
              <TotalTanksList></TotalTanksList>
            </ProtectedRoute>
          }
        ></Route>

        {/* <Route path="/officeWiseTankList" element={<ProtectedRoute><OfficeWiseTankList></OfficeWiseTankList></ProtectedRoute>} ></Route> */}

        <Route path="/uploadGos" element={<UploadGos />} />
        <Route path="/circularsReport" element={<CircularsReport />} />
      </Routes>
      {/* </ThemeProvider> */}
    </>
  );
}
