import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Table, Card, Alert } from "react-bootstrap";

import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import * as Yup from "yup";
import { CustomInput, CustomNumberInput, CustomSelect } from "../RTIComponents/CustomFields";
import RTIPrfmGService from "../../services/RTIPrfmGService";
import RTIPrfmCService from "../../services/RTIPrfmCService";
import "../../index.css"; // goes up 2 levels to reach src/index.css
import { useUserDetails } from "../../components/UserDetailsContext";

export default function RTIApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const rti = location.state?.rti || {}; // Retrieve `rti` from state
  const [rtiRejnSecList, setRtiRejnSecList] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUserDetails();
  const [isTransferred, setIsTransferred] = useState("");
  const [appnDate, setAppnDate] = useState("");
  const [pioRecDate, setPioRecDate] = useState("");
  const [transDate, setTransDate] = useState("");
  const [infoFurnDate, setInfoFurnDate] = useState("");
  const [rejectDate, setRejectDate] = useState("");
  const [refusedDate, setRefusedDate] = useState("");
  const isEditMode = !!rti.applicationId;
  const initialFields = {
    infoFurnDate: true,
    infoPartFull: true,
    rejectDate: true,
    rejectSectionId: true,
    refusedDate: true,
    deemedRefusal: true,
    requiredFields: {},
  };
  const initialForm = {
    appnNum: rti.appnNum || "",
    appnDate: rti.appnDate || "",
    apptName: rti.apptName || "",
    apptAddress: rti.apptAddress || "",
    pioRecDate: rti.pioRecDate || "",
    apptCategory: rti.apptCategory || "",
    descInfoReq: rti.descInfoReq || "",
    thirdParty: rti.thirdParty || "",
    isTransferred: rti.isTransferred || "",
    transDate: rti.transDate || "",
    transName: rti.transName || "",
    transMode: rti.transMode || "",
    transAmt: rti.transAmt || "",
    deemedPio: rti.deemedPio || "",
    appnFee: rti.appnFee || 0,
    chargesCollected: rti.chargesCollected || 0.0,
    totAmt: rti.totAmt || 0.0,
    infoFurnDate: rti.infoFurnDate || null,
    infoPartFull: rti.infoPartFull || "",
    rejectDate: rti.rejectDate || null,
    rejectSectionId: rti.rejectSectionId || "",
    refusedDate: rti.refusedDate || null,
    deemedRefusal: rti.deemedRefusal || "",
    appealMade: rti.appealMade || "",
    remarks: rti.remarks || "",
  };

  const [visibility, setVisibility] = useState({
    transDate: false,
    transName: false,
    transMode: false,
    transAmt: false,
    deemedPio: true,
    appnFee: true,
    chargesCollected: true,
    totAmt: true,
    infoFurnDate: true,
    infoPartFull: true,
    rejectDate: true,
    rejectSectionId: true,
    refusedDate: true,
    deemedRefusal: true,
    appealMade: true,
    remarks: true,
  });
  // Freeze up to and including March 31, 2025 → min date is April 1, 2025
  const freezeDate = new Date("2025-04-01");

  const validationSchema = Yup.object({
    appnNum: Yup.string().required("Application Number is required"),
    appnDate: Yup.date()
      .transform((value, originalValue) => {
        return originalValue ? new Date(originalValue) : null;
      })
      .required("Application Date is required"),

    apptName: Yup.string().required("Applicant Name is required"),
    apptAddress: Yup.string().required("Applicant Address is required"),
    apptCategory: Yup.string().required("Applicant Category is required"),

    pioRecDate: Yup.date()

      .transform((value, originalValue) => (originalValue ? new Date(originalValue) : null))
      .required("PIO Receipt Date is required")
      .test("after-max-of-freeze-and-appnDate", "PIO Receipt Date must be on or after the later of Application Date and Quarter Freeze Date", function (value) {
        const { appnDate } = this.parent;
        if (!value) return false;

        const minDate = appnDate && new Date(appnDate) > freezeDate ? new Date(appnDate) : freezeDate;

        return new Date(value) >= minDate;
      }),

    descInfoReq: Yup.string().required("Description Information is required"),
    thirdParty: Yup.string().required("Whether third party is required"),

    isTransferred: Yup.string().nullable(),

    transDate: Yup.date().nullable().min(Yup.ref("pioRecDate"), "Transfer date should be on or after PIO Receipt Date"),

    transName: Yup.string().nullable(),
    transMode: Yup.string().nullable(),
    transAmt: Yup.number()
      .typeError("Transfer Amount must be a valid number") // Ensures it's a valid number
      .integer("Transfer Amount must be a whole number") // Ensures it's an integer
      .min(0, "Transfer Amount must be non-negative") // Ensures it's zero or positive
      .nullable(), // Allows null values (optional)

    deemedPio: Yup.string().nullable(),
    appnFee: Yup.number()
      .typeError("Application Fee must be a number")
      .integer("Application Fee must be a whole number") // Ensures it's an integer
      .min(0, "Application Fee must be non-negative")
      .nullable(),
    chargesCollected: Yup.number().typeError("Charges Collected must be a number").integer("Charges Collected must be a whole number").min(0, "Charges Collected must be non-negative").nullable(),

    totAmt: Yup.number().test("isSumCorrect", "Total Amount must be the sum of Application Fee and Charges Collected", function () {
      return parseFloat(this.parent.appnFee || 0) + parseFloat(this.parent.chargesCollected || 0) === parseFloat(this.parent.totAmt || 0);
    }),

    infoFurnDate: Yup.date().nullable().min(Yup.ref("pioRecDate"), "Information Furnish date should be on or after PIO Receipt Date"),
    infoPartFull: Yup.string().nullable(),
    rejectDate: Yup.date().nullable().min(Yup.ref("pioRecDate"), "Reject date should be on or after PIO Receipt Date"),
    rejectSectionId: Yup.number().nullable(),
    refusedDate: Yup.date().nullable().min(Yup.ref("pioRecDate"), "Refused date should be on or after PIO Receipt Date"),
    deemedRefusal: Yup.string().nullable(),

    appealMade: Yup.string().nullable(),
    remarks: Yup.string().nullable(),
  }).test("conditional-validation", "Validation failed based on isTransferred value", function (values) {
    const {
      isTransferred,
      transDate,
      transName,
      transMode,
      transAmt,
      rejectDate,
      rejectSectionId,
      refusedDate,
      deemedRefusal,
      infoFurnDate,
      infoPartFull,
      deemedPio,
      appnFee,
      chargesCollected,
      totAmt,
    } = values;

    // Helper function to count valid optional fields
    const countValidFields = (...fields) => fields.filter(Boolean).length;

    // When isTransferred = Yes
    if (isTransferred === "Yes") {
      if (!transDate || !transName || !transMode || transAmt === undefined) {
        return this.createError({
          path: "isTransferred",
          message: "When 'isTransferred' is Yes, transDate, transName, transMode, and transAmt are required.",
        });
      }
    }

    // When isTransferred = No
    if (isTransferred === "No") {
      const rejectValid = rejectDate && rejectSectionId;
      const refusedValid = refusedDate && deemedRefusal;
      const infoFurnValid = infoFurnDate && infoPartFull;

      const optionalFieldsCount = countValidFields(deemedPio, appnFee, chargesCollected, totAmt);

      if (!(rejectValid || refusedValid || infoFurnValid) || optionalFieldsCount < 3) {
        return this.createError({
          path: "isTransferred",
          message:
            "When 'isTransferred' is No, either rejectDate & rejectSectionId, refusedDate & deemedRefusal, or infoFurnDate & infoPartFull are required. Additionally, all of deemedPio, appnFee, chargesCollected, or totAmt are required.",
        });
      }
    }

    // When isTransferred = Partly
    if (isTransferred === "Partly") {
      const rejectValid = rejectDate && rejectSectionId;
      const refusedValid = refusedDate && deemedRefusal;
      const infoFurnValid = infoFurnDate && infoPartFull;

      if (
        !transDate ||
        !transName ||
        !transMode ||
        transAmt === undefined ||
        !deemedPio ||
        appnFee === undefined ||
        chargesCollected === undefined ||
        totAmt === undefined ||
        !(rejectValid || refusedValid || infoFurnValid)
      ) {
        return this.createError({
          path: "isTransferred",
          message:
            "When 'isTransferred' is Partly, all trans fields, deemedPio, appnFee, chargesCollected, and totAmt are required. Additionally, either rejectDate & rejectSectionId, refusedDate & deemedRefusal, or infoFurnDate & infoPartFull are required.",
        });
      }
    }

    return true; // All validations passed
  });

  const [formData, setFormData] = useState(rti || initialForm);
  const [fields, setFields] = useState(initialFields);

  const isNumberKey = (event) => {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };
  // compute dynamic min date for pioRecDate field
  const computedMinDate = () => {
    const appnDate = formik.values.appnDate ? new Date(formik.values.appnDate) : null;
    // If no appnDate or appnDate is before freezeDate → min date is freezeDate
    // Else if appnDate is after freezeDate → min date is appnDate
    if (!appnDate || appnDate <= freezeDate) {
      return freezeDate;
    }
    return appnDate;
  };
  useEffect(() => {}, [isTransferred]);

  const visibilityConfig = {
    Yes: {
      transDate: true,
      transName: true,
      transMode: true,
      transAmt: true,
      deemedPio: false,
      appnFee: false,
      chargesCollected: false,
      totAmt: false,
      infoFurnDate: false,
      infoPartFull: false,
      rejectDate: false,
      rejectSectionId: false,
      refusedDate: false,
      deemedRefusal: false,
      appealMade: false,
      remarks: false,
    },
    No: {
      transDate: false,
      transName: false,
      transMode: false,
      transAmt: false,
      deemedPio: true,
      appnFee: true,
      chargesCollected: true,
      totAmt: true,
      infoFurnDate: true,
      infoPartFull: true,
      rejectDate: true,
      rejectSectionId: true,
      refusedDate: true,
      deemedRefusal: true,
      appealMade: true,
      remarks: true,
    },
    Partly: {
      transDate: true,
      transName: true,
      transMode: true,
      transAmt: true,
      deemedPio: true,
      appnFee: true,
      chargesCollected: true,
      totAmt: true,
      infoFurnDate: true,
      infoPartFull: true,
      rejectDate: true,
      rejectSectionId: true,
      refusedDate: true,
      deemedRefusal: true,
      appealMade: true,
      remarks: true,
    },
  };

  const handleTransferred = (e) => {
    const transferStatus = e.target.value;
    formik.setFieldValue("isTransferred", transferStatus);
    setFormData((prev) => ({ ...prev, isTransferred: transferStatus }));
    setFields(initialFields);
    setVisibility(visibilityConfig[transferStatus] || visibilityConfig.No);
  };
  // Functions for handling events can be defined here

  const toggleFields = (action) => {
    const updatedFields = {
      infoFurnDate: false,
      infoPartFull: false,
      rejectDate: false,
      rejectSectionId: false,
      refusedDate: false,
      deemedRefusal: false,
      requiredFields: {},
    };

    switch (action) {
      case "rejectoff":
        setFields(initialFields);
        updatedFields.infoFurnDate = true;
        updatedFields.infoPartFull = true;
        updatedFields.requiredFields.infoFurnDate = true;
        updatedFields.requiredFields.infoPartFull = true;

        updatedFields.rejectDate = null;
        updatedFields.rejectSectionId = null;
        updatedFields.refusedDate = null;
        updatedFields.deemedRefusal = null;
        formik.setFieldValue("rejectDate", ""); // or `null` if that's appropriate
        formik.setFieldValue("rejectSectionId", "");
        formik.setFieldValue("refusedDate", ""); // or `null` if that's appropriate
        formik.setFieldValue("deemedRefusal", "");
        break;
      case "refuseon":
        updatedFields.refusedDate = true;
        updatedFields.deemedRefusal = true;
        updatedFields.requiredFields.refusedDate = true;
        updatedFields.requiredFields.deemedRefusal = true;

        // Reset conflicting fields
        updatedFields.infoFurnDate = null;
        updatedFields.infoPartFull = null;
        updatedFields.rejectDate = null;
        updatedFields.rejectSectionId = null;
        break;
      case "rejecton":
        updatedFields.rejectDate = true;
        updatedFields.rejectSectionId = true;
        updatedFields.requiredFields.rejectDate = true;
        updatedFields.requiredFields.rejectSectionId = true;

        updatedFields.infoFurnDate = null;
        updatedFields.infoPartFull = null;
        updatedFields.refusedDate = null;
        updatedFields.deemedRefusal = null;
        break;
      default:
        break;
    }

    setFields((prevState) => ({
      ...prevState,
      ...updatedFields,
    }));
  };

  const formik = useFormik({
    initialValues: initialForm,
    validationSchema,
    onSubmit: (values, actions) => handleSubmit(values, actions),
    enableReinitialize: true, // Allow form to reinitialize when `initialForm` changes
  });

  const handleDateChange = (field, value) => {
    if (field === "appnDate") setAppnDate(value);
    if (field === "pioRecDate") setPioRecDate(value);
    if (field === "transDate") setTransDate(value);
    if (field === "infoFurnDate") setInfoFurnDate(value);
    if (field === "rejectDate") setRejectDate(value);
    if (field === "refusedDate") setRefusedDate(value);
    formik.setFieldValue(field, value);
    formik.validateField(field);
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Errors:", formik.errors);
    console.log("Values before submission:", values);

    try {
      const payload = {
        ...values,
        user: user,
      };
      const cleanedValues = { ...payload };

      if (values.isTransferred === "No") {
        cleanedValues.transferDate = null;
        cleanedValues.transferName = null;
        cleanedValues.transferAmount = null;
        cleanedValues.transferMode = null;
      } else if (values.isTransferred === "Yes") {
        cleanedValues.rejectionDate = null;
        cleanedValues.rejectedSectionId = null;
        cleanedValues.infoFurnishedDate = null;
        cleanedValues.infoPartFull = null;
        cleanedValues.refusedDate = null;
        cleanedValues.deemedRefusal = null;
      }
      // Retain important fields during edit
      cleanedValues.isLatest = rti.isLatest ?? true;
      if (rti.applicationId) {
        cleanedValues.createDate = rti.createDate; // Retain original createdDate
      }
      RTIPrfmCService.submitRtiCEntry(
        rti,
        cleanedValues,
        (response) => {
          alert(rti.applicationId ? "Form updated successfully!" : "Form submitted successfully!");

          if (response && response.data.message) {
            setMessage(response.data.message);
            navigate("/rtiappEdit", {
              state: { reload: true, message: response.data.message },
            });
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
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while submitting the form.");
    }
  };

  // const submitForm = async (e) => {
  //   e.preventDefault();
  //   // console.log("Submitting formData:", formData); // Verify formData before sending
  //   try {
  //     await axios.post("http://localhost:9092/rti/app/entry", formData);
  //     setFormData(initialForm);
  //     alert("Form submitted successfully!");
  //     //}
  //     navigate("/rtiappEEreport", { state: { reload: true } }); // Navigate back with reload flag
  //   } catch (error) {
  //     alert("There was an error submitting the form.");
  //     console.error("Error submitting form:", error);
  //   }
  // };
  useEffect(() => {
    setLoading(true);
    RTIPrfmGService.fetchRtiRejSections(
      (response) => {
        setRtiRejnSecList(response.data.data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching RTI rejection sections:", error);
        setError(error.message || "Failed to fetch data");
        setLoading(false);
      },
    );
  }, []);

  return (
    <div className="justify-content-center" style={{ justifyContent: "center" }}>
      <Card className="mb-3" style={{ width: "100%" }}>
        {message && (
          <Alert variant="success" className="m-3" style={{ height: "40px", textAlign: "centre" }}>
            {message}{" "}
          </Alert>
        )}

        {error?.message && (
          <Alert variant="danger" style={{ height: "40px" }}>
            {error.message}{" "}
          </Alert>
        )}
        {/* <Card.Header style={{  backgroundImage:'linear-gradient(to right,purple,#191970 )', color: 'white' }}  > <div className="text-center"> */}
        <Card.Header style={{ backgroundColor: "#00458b", color: "white" }}>
          {" "}
          <div className="text-center">
            <h3 className="card-header-text">Annexure-II</h3>
            <h3 className="card-header-text">Register-I : Register of Applications received and disposed of under RTI Act by the public Information Officer (Maintained by P.I.O)</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <form onSubmit={formik.handleSubmit}>
              {/* <Table className="table-bordered table-striped" style={{ width: '100%' }}> */}
              <Table className="rti-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th rowSpan={2}>Sl.No</th>
                    <th colSpan={2}>
                      <span className="required-asterisk">*</span>Application
                    </th>
                    <th colSpan={2}>
                      <span className="required-asterisk">*</span>Applicant
                    </th>
                    <th rowSpan={2}>
                      <span className="required-asterisk">*</span>Date of receipt by APIO / PIO
                    </th>
                    <th rowSpan={2}>
                      <span className="required-asterisk">*</span> Category of Appplicant BPL / Other
                    </th>
                  </tr>
                  <tr>
                    <th>No. </th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Address</th>
                  </tr>
                  <tr>
                    <th rowSpan={2}>1</th>
                    <th colSpan={2}>2</th>
                    <th colSpan={2}>3</th>
                    <th rowSpan={2}>4</th>
                    <th rowSpan={2}> 5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "2px solid #D3D3D3" }}>1</td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomInput name="appnNum" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomInput
                        name="appnDate"
                        type="date"
                        formik={formik}
                        onChange={(e) => formik.setFieldValue("appnDate", e.target.value)}
                        onKeyDown={(e) => e.preventDefault()}
                        disabled={isEditMode}
                      />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomInput name="apptName" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomInput name="apptAddress" as="textarea" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomInput
                        name="pioRecDate"
                        type="date"
                        formik={formik}
                        min={computedMinDate()?.toISOString().split("T")[0]}
                        onChange={(e) => handleDateChange("pioRecDate", e.target.value)}
                        onKeyDown={(e) => e.preventDefault()}
                        disabled={isEditMode}
                      />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomSelect
                        name="apptCategory"
                        formik={formik}
                        options={[
                          { label: "BPL", value: "BPL" },
                          { label: "other", value: "other" },
                        ]}
                        disabled={isEditMode}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Table className="rti-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th rowSpan={3}>
                      <span className="required-asterisk">*</span>Brief description of request for information
                    </th>
                    <th rowSpan={3}>
                      <span className="required-asterisk">*</span>Involving Third party information or not
                    </th>
                    <th colSpan={5}>Transmitted to other PIO under sec 6(3)</th>
                  </tr>
                  <tr>
                    <th rowSpan={2}>Transmitted for</th>
                    <th rowSpan={2}>Date</th>
                    <th rowSpan={2}>PIO and Office</th>
                    <th colSpan={2}> Amount</th>
                  </tr>
                  <tr>
                    <th>Court fee or DD/IPO No.</th>
                    <th>Rs.</th>
                  </tr>
                  <tr>
                    <th>6</th>
                    <th>7</th>
                    <th colSpan={5}>8A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomInput name="descInfoReq" type="textarea" formik={formik} disabled={isEditMode} />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomSelect
                        name="thirdParty"
                        formik={formik}
                        options={[
                          { label: "Yes", value: "Yes" },
                          { label: "No", value: "No" },
                        ]}
                        disabled={isEditMode}
                      />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomSelect
                        name="isTransferred"
                        formik={formik}
                        onChange={handleTransferred}
                        value={formik.values.isTransferred}
                        options={[
                          { label: "Fully", value: "Yes" },
                          { label: "Partly", value: "Partly" },
                          { label: "No", value: "No" },
                        ]}
                      />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.transDate && (
                        <CustomInput
                          name="transDate"
                          type="date"
                          formik={formik}
                          min={formik.values.pioRecDate}
                          onChange={(e) => formik.setFieldValue("transDate", e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      )}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.transName && <CustomInput name="transName" formik={formik} required={isTransferred === "Yes" || isTransferred === "Partly"} />}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.transMode && <CustomInput name="transMode" formik={formik} required={isTransferred === "Yes" || isTransferred === "Partly"} placeholder="Transaction Mode" />}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.transAmt && <CustomInput name="transAmt" formik={formik} required={isTransferred === "Yes" || isTransferred === "Partly"} placeholder="Transaction Amount" />}
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Table className="rti-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th rowSpan={2}>Deemed PIO name & designation</th>
                    <th rowSpan={2}>Amount for application fees paid(Rs)</th>
                    <th rowSpan={2}>Charges collected for furnishing of information (Rs)</th>
                    <th rowSpan={2}>Total amount collected (Col. 8C + Col. 9)(Rs)</th>
                    <th colSpan={2}>Information furnished</th>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <th>part/full</th>
                  </tr>
                  <tr>
                    <th>8B</th>
                    <th>8C</th>
                    <th>9</th>
                    <th>10</th>
                    <th colSpan={2}>11</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.deemedPio && <CustomInput name="deemedPio" formik={formik} required={isTransferred === "No" || isTransferred === "Partly"} />}{" "}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.appnFee && (
                        <CustomNumberInput
                          name="appnFee"
                          formik={formik}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldValue("totAmt", parseFloat(e.target.value) + parseFloat(formik.values.chargesCollected || 0));
                          }}
                          required={isTransferred === "No" || isTransferred === "Partly"}
                          className="form-control"
                          placeholder="Application Fee"
                        />
                      )}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.chargesCollected && (
                        <CustomNumberInput
                          name="chargesCollected"
                          formik={formik}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldValue("totAmt", parseFloat(formik.values.appnFee || 0) + parseFloat(e.target.value));
                          }}
                          required={isTransferred === "No" || isTransferred === "Partly"}
                          className="form-control"
                          placeholder="Charges Collected"
                        />
                      )}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.totAmt && <CustomNumberInput name="totAmt" formik={formik} placeholder="Total Amount" readOnly className="form-control" />}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {" "}
                      {visibility.infoFurnDate && fields.infoFurnDate && (
                        <CustomInput
                          name="infoFurnDate"
                          formik={formik}
                          type="date"
                          value={formik.values.infoFurnDate || " "}
                          required={fields.requiredFields.infoFurnDate}
                          onClick={() => toggleFields("rejectoff")}
                          min={rti ? rti.pioRecDate : pioRecDate}
                          onChange={(e) => handleDateChange("infoFurnDate", e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      )}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.infoPartFull && fields.infoPartFull && (
                        <CustomSelect
                          name="infoPartFull"
                          onClick={() => toggleFields("rejectoff")}
                          required={fields.requiredFields.infoPartFull}
                          formik={formik}
                          options={[
                            { label: "Fully", value: "Fully" },
                            { label: "Partly", value: "Partly" },
                          ]}
                        />
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Table className="rti-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Date of rejection</th>
                    <th>Sections under 8, 9, 11, 24 which information Rejected</th>
                    <th>Date of Refusal u/s 7(2) / 18(1)</th>
                    <th>Deemed Refusal u/s 7(2) / 18(1)</th>
                    <th>Whether Appeal made against decision of PIO u/s 19 (1) & 19 (3)</th>
                    <th>Any other information</th>
                  </tr>

                  <tr>
                    <th colSpan={1}>12</th>
                    <th colSpan={1}>13</th>
                    <th colSpan={1}>14</th>
                    <th colSpan={1}>15</th>
                    <th colSpan={1}>16</th>
                    <th colSpan={1}>17</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.rejectDate && fields.rejectDate && (
                        <CustomInput
                          name="rejectDate"
                          formik={formik}
                          type="date"
                          value={formik.values.rejectDate || ""}
                          required={fields.requiredFields.rejectDate}
                          onClick={() => toggleFields("rejecton")}
                          min={rti ? rti.pioRecDate : pioRecDate}
                          onChange={(e) => handleDateChange("rejectDate", e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      )}
                    </td>

                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {fields.rejectSectionId && (
                        <CustomSelect
                          name="rejectSectionId"
                          onClick={() => toggleFields("rejecton")}
                          options={[
                            ...rtiRejnSecList.map(({ rejectSectionId, rtiRejectionSection }) => ({
                              value: rejectSectionId,
                              label: rtiRejectionSection,
                            })),
                          ]}
                          formik={formik}
                        />
                      )}
                      <Form.Control.Feedback type="invalid">{formik.errors.rejectSectionId}</Form.Control.Feedback>
                    </td>

                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {visibility.refusedDate && fields.refusedDate && (
                        <CustomInput
                          name="refusedDate"
                          type="date"
                          formik={formik}
                          value={formik.values.refusedDate || ""}
                          required={fields.requiredFields.refusedDate}
                          onClick={() => toggleFields("refuseon")}
                          min={rti ? rti.pioRecDate : pioRecDate}
                          onChange={(e) => handleDateChange("refusedDate", e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      )}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      {" "}
                      {fields.deemedRefusal && (
                        <CustomSelect
                          name="deemedRefusal"
                          formik={formik}
                          onClick={() => toggleFields("refuseon")}
                          required={fields.requiredFields.deemedRefusal}
                          className="form-control"
                          options={[
                            { value: "7(2)", label: "7(2)" },
                            { value: "18(1)", label: "18(1)" },
                          ]}
                        />
                      )}
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomSelect
                        name="appealMade"
                        formik={formik}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                      />
                    </td>
                    <td style={{ border: "2px solid #D3D3D3" }}>
                      <CustomInput name="remarks" formik={formik} placeholder="Enter remarks" />
                    </td>
                  </tr>
                </tbody>
              </Table>
              <br />
              <Button variant="primary" type="submit">
                {rti.applicationId ? "Update" : "Submit"}
              </Button>
            </form>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
