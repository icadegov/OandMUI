import React from "react";
import { useState } from "react";
import { Card, Alert } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FinancialYearOptions } from "./FinancialYearOptions";
import WorkType from "./WorkType";
import MKDetails from "./MKDetails";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import AdminSanctionService from "../../services/AdminSanctionService";
import ProjectDetails from "./ProjectDetails";
import DistrictDetails from "./DistrictDetails";
import ApprovedAuthorityDetails from "./ApprovedAuthorityDetails";
import { useUserDetails } from "../UserDetailsContext";

function AdminSanctionForm() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selWorkType, setSelWorkType] = useState(0);
  const [key, setKey] = useState(0);
  const [message, setMessage] = useState("");
  const [errormsg, setErrormsg] = useState("");
  const [tankData, setTankData] = useState("");
  const [districtData, setdistrictData] = useState("");
  const [projectData, setProjectData] = useState("");
  const [adminFileUrl, setadminFileUrl] = useState("");
  const [approvedID, setapprovedID] = useState(0);
  const [benefitedDistData, setBenefitedDistData] = useState("");

  const { user } = useUserDetails();

  const getSelectedYear = (data) => {
    setSelectedYear(data);
    setSelWorkType("");
    setMessage("");
    setErrormsg("");
  };

  const selectedWorkType = (data) => {
    setSelWorkType(data);
  };

  const selApprovedId = (data) => {
    // console.log("data", JSON.stringify(data));
    setapprovedID({ authorityId: data.authorityId, finyearAmount: data.finyearAmount, perWork: data.perWork, enteredASAmt: data.enteredASAmt });
  };

  const selTankDetails = (data) => {
    setTankData(data);
  };
  const selProjectDetails = (data) => {
    if (Number(selWorkType) === 1) {
      setProjectData({ projectId: data.projectId, reservoirId: data.reservoirId });
    } else if (Number(selWorkType) === 3) {
      setProjectData({ projectId: data.projectId, liftId: data.liftId });
    } else if (Number(selWorkType) === 4) {
      setProjectData({ smallLiftId: data.smallLiftId });
    } else {
      setProjectData({ projectId: data.projectId });
    }
  };
  const selDistrictDetails = (seldis, selMan, selVill) => {
    const data = { districtId: seldis, mandalId: selMan, villageId: selVill };
    setdistrictData(data);
  };

  const selMultipleVillages = (selVill) => {
    //console.log("selVill", JSON.stringify(selVill));

    setBenefitedDistData(selVill);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      //setErrormsg('Please upload a valid .pdf file');
      formik.setFieldError("adminFileUrl", "Please upload a valid .pdf file");
      setadminFileUrl(null);
      e.target.value = "";
    } else if (file && file.size > 1024 * 1024 * 10) {
      //setErrormsg('Please upload a file less than 10MB');
      formik.setFieldError("adminFileUrl", "Please upload a file less than 10MB");
      setadminFileUrl(null);
      e.target.value = "";
    } else {
      setErrormsg("");
      setadminFileUrl(file);
    }
  };

  const FILE_SIZE = 1024 * 1024 * 10; // 10MB
  //const SUPPORTED_FORMATS = ['application/pdf'];
  const validationSchema = yup.object({
    workName: yup.string().required("Work called by is required"),

    hoaId: yup.string().required("Work called by is required").notOneOf([""], "Please select a valid HOA"),
    //approvedById: yup.number().typeError('Please enter a valid number').required('Approved By is required'),
    adminSanctionAmt: yup
      .number()
      .typeError("Please enter a valid amount") // Ensures it's a number
      .positive("Amount must be positive") // Must be greater than 0
      .min(1001, "Amount must be greater than 1000") // Ensures it's > 1000
      //.max(approvedID.perWork, `Amount must be less than ${approvedID?.perWork/100000 ?? 0 } Lakhs `)
      .required("Admin Sanction Amount is required"),
    //adminSanctionDate: yup.date().required('Agreement Date is required').typeError('Invalid date format'),
    // adminSanctionUrl: yup.string().required('Admin Sanction File is required'),
    adminFileUrl: yup
      .mixed()
      .test("fileType", "Only PDF files are allowed.", (value) => (value ? value.type === "application/pdf" : true))
      .test("fileSize", "File size should be under 10MB.", (value) => (value ? value.size <= FILE_SIZE : true)),
  });

  const formik = useFormik({
    initialValues: {
      workName: "",
      workId: "",
      workType: "",
      hoaId: " ",
      approvedById: "",
      adminSanctionAmt: "",
      adminSanctionDate: "",
      projectId: "",
      unitId: "",
      circleId: "",
      divisionId: "",
      subDivisionId: "",
      resId: "",
      districtId: "",
      mandalId: "",
      villageId: "",
      tankId: "",
      finyear: "",
      adminFileUrl: "",
      referenceNumber: "",
      referenceDate: "",
      projSubTypeId: "",
      scstFunds: "3",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      //console.log('Form values:', approvedID.finyearAmount);
      const enteredAS = values.adminSanctionAmt + approvedID.enteredASAmt;
      if (enteredAS > approvedID.finyearAmount) {
        formik.setFieldError("adminSanctionAmt", `Admin Sanction Amount can't be greater than ${approvedID.finyearAmount / 100000 ?? 0} Lakhs `);
        return;
      }
      const selMulVillages = benefitedDistData && benefitedDistData.map((v) => v.benefitedVname).join(", ");

      const formData = new FormData();
      formData.append(`workName`, values.workName);
      formData.append(`workTypeId`, selWorkType);
      formData.append(`approvedById`, approvedID.authorityId);
      formData.append(`hoaId`, values.hoaId);
      formData.append(`adminSanctionAmt`, values.adminSanctionAmt);
      formData.append(`adminSanctionDate`, values.adminSanctionDate);
      formData.append(`referenceNumber`, values.referenceNumber);
      formData.append(`referenceDate`, values.referenceDate);
      formData.append(`projectId`, projectData?.projectId ?? ""); // undefined and null checking
      formData.append(`unitId`, user.unitId);
      formData.append(`circleId`, user.circleId);
      formData.append(`divisionId`, user.divisionId);
      formData.append(`subDivisionId`, user.subDivisionId);
      formData.append(`resId`, projectData?.reservoirId ?? ""); // undefined and null checking
      formData.append(`districtId`, districtData?.districtId ?? ""); // undefined and null checking
      formData.append(`mandalId`, districtData?.mandalId ?? ""); // undefined and null checking
      formData.append(`villageId`, districtData?.villageId ?? ""); // undefined and null checking
      formData.append(`tankId`, tankData?.tankId ?? "");
      formData.append(`tankCode`, tankData?.tankCode ?? "");
      formData.append(`tankName`, tankData?.tankName ?? "");
      formData.append(`financialYear`, selectedYear);
      formData.append(`projSubTypeId`, values?.projSubTypeId ?? 0);
      formData.append(`adminFileUrl`, adminFileUrl);
      formData.append(`updatedby`, user.username);

      formData.append(`scstFunds`, values?.scstFunds ?? "3");
      formData.append(`scstVillages`, selMulVillages ?? "NA");
      formData.append(`scstList`, JSON.stringify(benefitedDistData) ?? "");
      formData.append(`liftId`, projectData?.liftId ?? "");
      formData.append(`smallLiftId`, projectData?.smallLiftId ?? "");

      AdminSanctionService.submitAdminSanctions(
        formData,
        (response) => handleResponse(response),
        (error) => handleerror(error),
      );
      setdistrictData("");
      setTankData("");
      setSelectedYear("");
      setSelWorkType(0);
      setProjectData("");
      setapprovedID(0);
      setBenefitedDistData("");
      setadminFileUrl(null);
      setKey((prevKey) => prevKey + 1);
      resetForm();
    },
  });
  const handleResponse = (response) => {
    setMessage(response.data.message);
  };
  const handleerror = (error) => {
    setErrormsg(error.data?.error.data.message || "Error in Submisssion");
  };

  return (
    <div className="d-flex justify-content-center m-3">
      <Card className="mb-3" style={{ width: "80%" }}>
        {message && (
          <Alert variant="success" className="m-3" style={{ height: "40px", textAlign: "left" }}>
            {message}{" "}
          </Alert>
        )}

        {errormsg && (
          <Alert variant="danger" style={{ height: "40px" }}>
            {errormsg}{" "}
          </Alert>
        )}

        <Card.Header className="Card-header" as="h5">
          Administrative Sanction
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Col sm={6}>
                  <Form.Group as={Row} controlId="formGridFinYear">
                    <Form.Label column sm={6}>
                      Select Financial Year:
                    </Form.Label>
                    <Col sm={6}>
                      <FinancialYearOptions key={key} selectedYearFromChild={getSelectedYear}></FinancialYearOptions>
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group as={Row} controlId="formGridFinYear">
                    <Form.Label row column sm={6}>
                      Select Work Type:
                    </Form.Label>
                    <Col sm={6}>
                      <WorkType key={selectedYear} selWorkTypeFromChild={selectedWorkType}></WorkType>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "nowrap" }}>
                {selWorkType > 0 && (Number(selWorkType) === 1 || Number(selWorkType) === 3 || Number(selWorkType) === 4) && (
                  <>
                    <ProjectDetails workType={selWorkType} selProjectDetFromChild={selProjectDetails}></ProjectDetails>

                    {selWorkType > 0 && Number(selWorkType) === 1 && (
                      <Form.Group as={Col} controlId="formGridFinYear">
                        <Form.Label>Select Sub Type</Form.Label>
                        <Form.Select id="projSubTypeId" name="projSubTypeId" value={formik.values.projSubTypeId} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
                          <option value="">--Select Type--</option>
                          <option value="1">Canal system</option>
                          <option value="2">Dams and Appurtenant(Civil)</option>
                          <option value="3">Dams and Appurtenant(H&M)</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formik.errors.nameOfWork}</Form.Control.Feedback>
                      </Form.Group>
                    )}
                  </>
                )}
              </div>
              <Row style={{ display: "flex", alignItems: "center", gap: "10px" }}>{selWorkType > 0 && Number(selWorkType) === 2 && <MKDetails selectedTankFromChild={selTankDetails}></MKDetails>}</Row>

              <Row className="mb-3">{selWorkType > 0 && Number(selWorkType) !== 2 && <DistrictDetails type="single" selDistrictDetFromChild={selDistrictDetails}></DistrictDetails>}</Row>
              <Alert variant="info" style={{ height: "40px" }}>
                Enter Administrative Sanction Details
              </Alert>
              <Row className="mb-3">
                {/* Name of the Work */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Name of the Work</Form.Label>
                    <Form.Control
                      type="text"
                      id="workName"
                      name="workName"
                      placeholder="Enter name of the work"
                      value={formik.values.workName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.workName && !!formik.errors.workName}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.workName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Head of Account */}
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Select Head of Account</Form.Label>
                    <Form.Select
                      id="hoaId"
                      name="hoaId"
                      value={formik.values.hoaId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.hoaId && formik.touched.hoaId}
                      required
                    >
                      <option value="">--Select HOA--</option>
                      <option value="1">2700-01-800-00-26-270-272</option>
                      <option value="2">2700-01-800-00-27-270-272</option>
                      <option value="3">2700-01-800-00-05-270-272</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{formik.errors.hoaId}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Admin Approved By */}
                <Col>
                  <ApprovedAuthorityDetails key={selectedYear} selApprovedIdFromChild={selApprovedId}></ApprovedAuthorityDetails>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label className="label-controlPMS rowdarkgrren">Admin Sanction Amount in Rupees</Form.Label>
                    <Form.Control
                      type="number"
                      id="adminSanctionAmt"
                      name="adminSanctionAmt"
                      placeholder="Admin Sanction Amount"
                      value={formik.values.adminSanctionAmt}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.adminSanctionAmt && formik.touched.adminSanctionAmt}
                      required
                    />
                    {formik.values.adminSanctionAmt && (
                      <Form.Text className="text-muted">
                        <div style={{ color: "green", marginTop: "5px" }}>Entered amount: {formik.values.adminSanctionAmt / 100000} Lakh</div>
                      </Form.Text>
                    )}
                    <Form.Control.Feedback type="invalid">{formik.errors.adminSanctionAmt}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label className="label-controlPMS rowdarkgrren">Admin Sanction Reference Number</Form.Label>
                    <Form.Control
                      type="text"
                      id="referenceNumber"
                      name="referenceNumber"
                      placeholder="Admin Sanction Reference Number"
                      value={formik.values.referenceNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.referenceNumber}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label className="label-controlPMS rowdarkgrren">Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Enter Administrative Sanction Date."
                      id="referenceDate"
                      name="referenceDate"
                      required
                      value={formik.values.referenceDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.referenceDate}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Upload Admin Sanction Copy</Form.Label>
                    <Form.Control
                      type="file"
                      placeholder="Upload"
                      id="adminFileUrl"
                      name="adminFileUrl"
                      onChange={handleFileChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.adminFileUrl && formik.touched.adminFileUrl}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.adminFileUrl}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Alert variant="info" style={{ height: "40px" }}>
                Enter SC/ST Benefited Villages
              </Alert>

              <Row className="mb-3">
                <Col md={3}>
                  <div className="d-flex gap-3">
                    <Form.Label>State Development funds</Form.Label>
                    <Form.Check
                      type="radio"
                      id="sc"
                      name="scstFunds"
                      label="SC"
                      value="1"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.scstFunds === "1"}
                      isInvalid={formik.touched.scstFunds && !!formik.errors.scstFunds}
                    />
                    <Form.Check
                      type="radio"
                      id="st"
                      name="scstFunds"
                      label="ST"
                      value="2"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.scstFunds === "2"}
                      isInvalid={formik.touched.scstFunds && !!formik.errors.scstFunds}
                    />
                    <Form.Check type="radio" id="other" name="scstFunds" label="Other" value="3" onChange={formik.handleChange} onBlur={formik.handleBlur} checked={formik.values.scstFunds === "3"} />
                  </div>

                  <Form.Control.Feedback type="invalid">{formik.errors.scst}</Form.Control.Feedback>
                </Col>
                <Col> {(formik.values.scstFunds === "1" || formik.values.scstFunds === "2") && <DistrictDetails type="multiple" selDistrictDetFromChild={selMultipleVillages}></DistrictDetails>}</Col>
              </Row>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </form>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminSanctionForm;
