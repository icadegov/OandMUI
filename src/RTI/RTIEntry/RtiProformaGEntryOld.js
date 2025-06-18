import React, { useEffect, useState } from "react";
import { Button, Form, Table, Card, Alert } from "react-bootstrap"; // If you are using react-bootstrap
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomInput, CustomSelect, CustomNumberInput } from "../RTIComponents/CustomFields";
import RTIPrfmGService from "../../services/RTIPrfmGService";
import { useUserDetails } from "../../components/UserDetailsContext";

export default function RtiProformaGEntryOld() {
  const location = useLocation();
  const rti = location.state?.rtiG || {}; // Retrieve `rti` from state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [error, setError] = useState(null);
  const { user } = useUserDetails();

  const [appealDate, setAppealDate] = useState("");
  const [appealReceiptDate, setAppealReceiptDate] = useState("");
  const [appnDate, setAppnDate] = useState("");
  const [appellateFirstDecisionDate, setAppellateFirstDecisionDate] = useState("");
  const [rtiRejnSecList, setRtiRejnSecList] = useState([]);
  const isEditMode = !!rti.proGId;
  const fetchRtiRejSections = () => {
    RTIPrfmGService.fetchRtiRejSections(
      (response) => {
        setRtiRejnSecList(response.data.data);
      },
      (error) => {
        setError("Failed to fetch RTI Rejection sections.");
        console.error(error);
      },
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchRtiRejSections();
    setLoading(false);
  }, []);

  const initialForm = {
    appealNum: rti.appealNum || "",
    appealDate: rti.appealDate || "",
    nameOfAppellant: rti.nameOfAppellant || "",
    appellantAddress: rti.appellantAddress || "",
    appealReceiptDate: rti.appealReceiptDate || "",
    pioName: rti.pioName || "",
    pioDesignation: rti.pioDesignation || "",
    appnNum: rti.appnNum || "",
    appnDate: rti.appnDate || "",
    appellateAuthorityName: rti.appellateAuthorityName || "",
    appellateAuthorityAddre: rti.appellateAuthorityAddre || "",
    appellateFirstDecisionDate: rti.appellateFirstDecisionDate || "",
    appellateFirstDecisionAllowRejec: rti.appellateFirstDecisionAllowRejec || "",
    rejectSectionId: rti.rejectSectionId || "",

    chargeForInfo: rti.chargeForInfo || 0.0,
    secondAppealMade: rti.secondAppealMade || "",
    secondAppealNoticeNum: rti.secondAppealNoticeNum || "",
    secondAppealNoticeDate: rti.secondAppealNoticeDate || "",
    secondAppealHearingDate: rti.secondAppealHearingDate || "",
    remarks: rti.remarks || "",
  };
  // Freeze up to and including March 31, 2025 → min date is April 1, 2025
  const freezeDate = new Date("2025-04-01");
  const validationSchema = Yup.object().shape({
    appealNum: Yup.string().required("Appeal No is required"),
    appealDate: Yup.date().required("Appeal Date is required"),
    nameOfAppellant: Yup.string().required("Name of Appellant is required"),
    appellantAddress: Yup.string().required("Address of Appellant is required"),
    appealReceiptDate: Yup.date()
      .min(Yup.ref("appealDate"), "Appeal Receipt Date must be on or after Appeal Date")
      .required("Date of Receipt of Appeal is required")
      .test("after-max-of-freeze-and-appealDate", "PIO Receipt Date must be on or after the later of Appeal Date and Quarter Freeze Date", function (value) {
        const { appealDate } = this.parent;
        if (!value) return false;

        const minDate = appealDate && new Date(appealDate) > freezeDate ? new Date(appealDate) : freezeDate;

        return new Date(value) >= minDate;
      }),
    pioName: Yup.string().required("PIO Name is required"),
    pioDesignation: Yup.string().required("PIO Designation is required"),
    appnNum: Yup.string().required("Application No is required"),
    appnDate: Yup.date().max(Yup.ref("appealDate"), "Application Date cannot be later than Appeal Date").required("Application Date is required"),
    appellateAuthorityName: Yup.string().required("Name of Appellate Authority is required"),
    appellateAuthorityAddre: Yup.string().required("Address of Appellate Authority is required"),

    appellateFirstDecisionDate: Yup.date()
      .nullable()
      .test("date-and-decision-required", "If a Decision Date is provided, Allow/Reject must also be selected", function (value) {
        const { appellateFirstDecisionAllowRejec } = this.parent;
        return (!value && !appellateFirstDecisionAllowRejec) || (value && appellateFirstDecisionAllowRejec);
      })
      .min(Yup.ref("appealReceiptDate"), "Decision Date must be on or after Appeal Receipt Date"),

    appellateFirstDecisionAllowRejec: Yup.string()
      .nullable()

      .test("decision-and-date-required", "If Allow/Reject is selected, a Decision Date must also be provided", function (value) {
        const { appellateFirstDecisionDate } = this.parent;
        return (!value && !appellateFirstDecisionDate) || (value && appellateFirstDecisionDate);
      }),

    rejectSectionId: Yup.number()
      .nullable()
      .test("reject-section-required", "Rejection Section ID is required when 'Rejected' is selected", function (value) {
        const { appellateFirstDecisionAllowRejec } = this.parent;
        if (appellateFirstDecisionAllowRejec === "2") {
          return value != null && value !== ""; // Ensure it's not null or empty
        }
        return true; // Skip validation when not "Rejected"
      }),
    chargeForInfo: Yup.number().nullable().integer("Must be a positive number").typeError("Must be a number"),
    secondAppealMade: Yup.string().nullable(),
    secondAppealNoticeNum: Yup.string().nullable(),
    secondAppealNoticeDate: Yup.date().nullable().min(Yup.ref("appellateFirstDecisionDate"), "Second Appeal Notice Date  must be on or after Appellate First Decision Date"),
    secondAppealHearingDate: Yup.date().nullable().min(Yup.ref("appellateFirstDecisionDate"), "Second Appeal Hearing Date   must be on or after Appellate First Decision Date"),
    remarks: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: initialForm,
    validationSchema,
    onSubmit: (values, actions) => handleSubmit(values, actions),
    enableReinitialize: true, // Allow form to reinitialize when `initialForm` changes
  });

  const computedMinDate = () => {
    const appealDate = formik.values.appealDate ? new Date(formik.values.appealDate) : null;
    // If no appnDate or appnDate is before freezeDate → min date is freezeDate
    // Else if appnDate is after freezeDate → min date is appnDate
    if (!appealDate || appealDate <= freezeDate) {
      return freezeDate;
    }
    return appealDate;
  };
  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      ...values,
      user: user, // Include user details
    };
    if (rti.proGId) {
      // Edit existing entry
      const formDataWithProGId = {
        ...payload,
        proGId: rti.proGId,
        deleteFlag: values.deleteFlag ?? false,
        isLatest: rti.isLatest ?? true, // Retain isLatest
        createdTime: rti.createdTime,
      };
      // console.log("intialFormWithProGId", formDataWithProGId);
      RTIPrfmGService.updateRtiGEntry(
        rti.proGId,
        formDataWithProGId,
        (response) => {
          if (response && response.data.message) {
            setMessage(response.data.message);
            navigate("/rtiproformaGEdit", { state: { reload: true, message: response.data.message } });
          } else {
            console.error("Message key is missing in response!");
          }
          resetForm();
        },
        (error) => {
          console.error("Update failed:", error);
          alert("There was an error updating the form.");
        },
      );
    } else {
      // Perform form submission logic
      console.log("Form submitted with values:", values);
      RTIPrfmGService.submitRtiGEntry(
        {
          ...payload,
          isLatest: true, // Ensure isLatest is set during creation
        },
        (response) => {
          if (response && response.data.message) {
            setMessage(response.data.message);
            navigate("/rtiproformaGEdit", { state: { reload: true, message: response.data.message } });
          } else {
            console.error("Message key is missing in response!");
          }
          resetForm();
        },

        (error) => {
          console.error("Submission failed:", error);
          alert("There was an error submitting the form.");
        },
      );
    }
  };

  const cellStyle = {
    border: "2px solid #D3D3D3",
    textAlign: "center",
    wordWrap: "break-word",
  };
  const thStyle = { ...cellStyle };
  const thCommonProps = (width, align = "center") => ({ style: thStyle, width, align });

  const handleDateChange = (field, value) => {
    if (field === "appealDate") setAppealDate(value);
    if (field === "appealReceiptDate") setAppealReceiptDate(value);
    if (field === "appnDate") setAppnDate(value);
    if (field === "appellateFirstDecisionDate") setAppellateFirstDecisionDate(value);

    formik.setFieldValue(field, value);
    formik.validateField(field);
  };
  return (
    <div className="d-flex justify-content-center m-3">
      <Card className="mb-3" style={{ width: "90%" }}>
        {message && (
          <Alert variant="success" className="m-3" style={{ height: "40px", textAlign: "left" }}>
            {message}{" "}
          </Alert>
        )}

        {error?.message && (
          <Alert variant="danger" style={{ height: "40px" }}>
            {error.message}{" "}
          </Alert>
        )}

        {/* <Card.Header style={{ backgroundImage: 'linear-gradient(to right,purple,#191970 )', color: 'white' }}> */}
        <Card.Header style={{ backgroundColor: "#00458b", color: "white" }}>
          <div className="text-center">
            <h3 className="card-header-text">Register-II : Register of First Appeals maintained by the 1st Appellate Authority</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <form onSubmit={formik.handleSubmit}>
              <Table bordered className="rti-table">
                <thead>
                  <tr>
                    <th style={{ ...cellStyle }} width="5%">
                      <span className="required-asterisk">*</span>Appeal No
                    </th>
                    <th style={{ ...cellStyle }} width="10%">
                      <span className="required-asterisk">*</span>Appeal Date
                    </th>
                    <th style={{ ...cellStyle }} width="10%">
                      <span className="required-asterisk">*</span>Name of Appellant
                    </th>
                    <th style={{ ...cellStyle }} width="15%">
                      <span className="required-asterisk">*</span>Address of Appellant
                    </th>
                    <th style={{ ...cellStyle }} width="10%">
                      <span className="required-asterisk">*</span>Date of Receipt of Appeal by Appellate Authority
                    </th>
                    <th style={{ ...cellStyle }} width="15%">
                      <span className="required-asterisk">*</span>Name of PIO
                    </th>
                    <th style={{ ...cellStyle }} width="10%">
                      <span className="required-asterisk">*</span>Designation of PIO
                    </th>
                    <th style={{ ...cellStyle }} width="10%">
                      <span className="required-asterisk">*</span>Application No
                    </th>
                    <th style={{ ...cellStyle }} width="10%">
                      <span className="required-asterisk">*</span>Application Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...cellStyle }}>
                      <CustomInput name="appealNum" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput
                        name="appealDate"
                        type="date"
                        onChange={(e) => handleDateChange("appealDate", e.target.value)}
                        formik={formik}
                        onKeyDown={(e) => e.preventDefault()}
                        disabled={isEditMode}
                      />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput name="nameOfAppellant" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput name="appellantAddress" as="textarea" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput
                        name="appealReceiptDate"
                        type="date"
                        min={computedMinDate()?.toISOString().split("T")[0]}
                        onChange={(e) => handleDateChange("appealReceiptDate", e.target.value)}
                        formik={formik}
                        onKeyDown={(e) => e.preventDefault()}
                        disabled={isEditMode}
                      />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput name="pioName" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput name="pioDesignation" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput name="appnNum" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput
                        name="appnDate"
                        type="date"
                        max={appealDate}
                        onChange={(e) => handleDateChange("appnDate", e.target.value)}
                        formik={formik}
                        onKeyDown={(e) => e.preventDefault()}
                        disabled={isEditMode}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Table bordered className="rti-table">
                <thead>
                  <tr>
                    <th rowSpan="2" {...thCommonProps("10%")}>
                      <span className="required-asterisk">*</span>Name of Appellate Authority
                    </th>
                    <th rowSpan="2" {...thCommonProps("8%")}>
                      <span className="required-asterisk">*</span>Address of Appellate Authority
                    </th>
                    <th colSpan="3" {...thCommonProps("25%")}>
                      Decision by 1st Appellate Authority
                    </th>
                    <th rowSpan="2" {...thCommonProps("8%")}>
                      Charges Collected for furnishing info(Rs)
                    </th>
                    <th colSpan="4" {...thCommonProps("30%")}>
                      Whether 2nd Appeal made u/s 19 (3)
                    </th>
                    <th rowSpan="2" {...thCommonProps("13%")}>
                      Any other information
                    </th>
                  </tr>
                  <tr>
                    <th {...thCommonProps("20%")}>Date</th>
                    <th {...thCommonProps("40%")}>Allowed</th>
                    <th {...thCommonProps("40%")}>Rejected u/s 8,9,11 & 24</th>
                    <th {...thCommonProps("20%")}>Decision</th>
                    <th {...thCommonProps("20%")}>Notice Number</th>
                    <th {...thCommonProps("30%")}>Notice Date</th>
                    <th {...thCommonProps("30%")}>Hearing Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...cellStyle }}>
                      <CustomInput name="appellateAuthorityName" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput name="appellateAuthorityAddre" as="textarea" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomInput
                        name="appellateFirstDecisionDate"
                        type="date"
                        min={rti ? rti.appealReceiptDate : appealReceiptDate}
                        onChange={(e) => handleDateChange("appellateFirstDecisionDate", e.target.value)}
                        formik={formik}
                        onKeyDown={(e) => e.preventDefault()}
                      />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomSelect
                        name="appellateFirstDecisionAllowRejec"
                        formik={formik}
                        options={[
                          { label: "Allowed", value: "1" },
                          { label: "Rejected", value: "2" },
                        ]}
                        onChange={(e) => {
                          formik.setFieldValue("appellateFirstDecisionAllowRejec", e.target.value);
                        }}
                      />
                    </td>

                    <td style={{ ...cellStyle }}>
                      {(formik.values.appellateFirstDecisionAllowRejec === "2" || formik.values.appellateFirstDecisionAllowRejec === 2) && (
                        <CustomSelect
                          name="rejectSectionId"
                          options={[...rtiRejnSecList.map(({ rejectSectionId, rtiRejectionSection }) => ({ value: rejectSectionId, label: rtiRejectionSection }))]}
                          formik={formik}
                        />
                      )}
                      <Form.Control.Feedback type="invalid">{formik.errors.rejectSectionId}</Form.Control.Feedback>
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomNumberInput name="chargeForInfo" formik={formik} placeholder="Enter charges" />
                    </td>
                    <td style={{ ...cellStyle }}>
                      <CustomSelect
                        name="secondAppealMade"
                        formik={formik}
                        options={[
                          { label: "Yes", value: "Yes" },
                          { label: "No", value: "No" },
                        ]}
                      />
                    </td>

                    <td style={{ ...cellStyle }}>{formik.values.secondAppealMade === "Yes" && <CustomInput name="secondAppealNoticeNum" formik={formik} />}</td>
                    <td style={{ ...cellStyle }}>
                      {formik.values.secondAppealMade === "Yes" && (
                        <CustomInput
                          name="secondAppealNoticeDate"
                          type="date"
                          formik={formik}
                          min={rti ? rti.appellateFirstDecisionDate : appellateFirstDecisionDate}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      )}
                    </td>
                    <td style={{ ...cellStyle }}>
                      {formik.values.secondAppealMade === "Yes" && (
                        <CustomInput
                          name="secondAppealHearingDate"
                          type="date"
                          formik={formik}
                          min={rti ? rti.appellateFirstDecisionDate : appellateFirstDecisionDate}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      )}
                    </td>

                    <td style={{ ...cellStyle }}>
                      <CustomInput name="remarks" as="textarea" formik={formik} />
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Button variant="primary" type="submit">
                {rti.proGId ? "Update" : "Submit"}
              </Button>
            </form>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
