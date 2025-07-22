import React from 'react'
import { Card, Alert } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import ReportsService from '../../services/ReportsService';
import { useState, useEffect } from 'react';
import { useFormik } from "formik";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import { FinancialYearOptions } from '../Entry/FinancialYearOptions';
import Button from 'react-bootstrap/Button';
import { useNavigate  } from 'react-router-dom'; 
import UserOfficeDetails from "../Entry/UserOfficeDetails";
import UserService from '../../services/UserService';
import AdminSanctionService from '../../services/AdminSanctionService';
import { useUserDetails } from "../UserDetailsContext";
import * as yup from "yup";



 const AdminSanctionEdit = () => {
 const { user } = useUserDetails();
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [unitId, setUnitId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [approvedById, setApprovedById] = useState("");

  // 🔁 Child-to-parent values from UserOfficeDetails
  const [circleId, setCircleId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [subDivisionId, setSubDivisionId] = useState("");
  const [reportData, setReportData] = useState([]);
  const [errorData, setErrorData] = useState(null);
  const [message, setMessage] = useState("");
  const [errormsg, setErrormsg] = useState("");


  const formik = useFormik({
    initialValues: {
      workId: "",
      circleId: "",
      divisionId: "",
      subDivisionId: "",
    },
    validationSchema: yup.object({
      workId: yup.string().required("Work is required"),
      circleId: yup.string().required("Circle is required"),
      divisionId: yup.string().required("Division is required"),
      subDivisionId: yup.string().required("Sub Division is required"),
    }),
    onSubmit: (values) => {
      AdminSanctionService.submiAssignedWorks(
        values,
        (res) => setMessage(res.data.message),
        (err) => setErrormsg(err.message),
      );
    },
  });


  const getSelectedValues = (data) => {
    formik.setValues({
      ...formik.values,
      circleId: data.circle,
      divisionId: data.division,
      subDivisionId: data.subdivision,
    });
    setCircleId(data.circle);
    setDivisionId(data.division);
    setSubDivisionId(data.subdivision);
  };


  useEffect(() => {
    UserService.getUnits(
      (res) => {
        setUnits(res.data.data);
        setErrorData(null);
      },
      (err) => {
        console.error(err);
        setErrorData("Error fetching units");
      }
    );
  }, []);

  useEffect(() => {
    if (unitId && approvedById && selectedYear) {
      ReportsService.fetchSanctionAuthorityAndOfficeWise(
        {
          params: {
            unitId,
            circleId,
            divisionId,
            subDivisionId,
            financialYear: selectedYear,
            approvedById,
          },
        },
        (res) => {
          setReportData(res.data.data);
          setErrorData(null);
        },
        (err) => {
          console.error(err);
          setErrorData("Error fetching data");
        }
      );
    }
  }, [unitId, approvedById, selectedYear, circleId, divisionId, subDivisionId]);

  const handleUnitChange = (e) => {
    setUnitId(e.target.value);
    setApprovedById("");
    setReportData([]);
  };

  const handleYearChange = (yr) => {
    setSelectedYear(yr);
    setApprovedById("");
    setReportData([]);
  };

  const handleSanctionChange = (e) => {
    setApprovedById(e.target.value);
  };

  const handleEditScreen = (workId) => {
    ReportsService.fetchDataByWorkId(
      { params: { workId } },
      (res) => {
        navigate("/submitASEdit", { state: { workData: res.data } });
      },
      (err) => {
        console.error(err);
        setErrorData("Error fetching work data");
      }
    );
  };

  const handleDeleteScreen = (workId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this record?");
  if (!confirmDelete) return;
     AdminSanctionService.deleteByWorkId(
     { params: { workId } },
    (response) => {
      alert("Deleted successfully");
    },
    (error) => {
      console.error("Delete failed", error);
      alert("Delete failed. Please try again.");
    }
  );
};
 
  return (
    <div className='d-flex justify-content-center m-3'>
      <Card className="mb-3" style={{ width: '80%' }}>
        <Card.Header className='Card-header'>Edit Administrative Sanctions</Card.Header>
        <Card.Body >

          <Card.Text></Card.Text>
       <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="unitSelect">
            <Form.Label>Select Unit</Form.Label>
            <Form.Select value={unitId} onChange={handleUnitChange} required>
              <option value="">-- Select Unit --</option>
              {units.map((u) => (<option key={u.unitId} value={u.unitId}> {u.unitName}  </option>  ))}
            </Form.Select>
          </Form.Group>
          <UserOfficeDetails selectedValueFromChild={getSelectedValues} unitId={unitId} />
        </Row>

        <Row className="mb-3 align-items-center">
          <Form.Group as={Col} controlId="finYear">
            <Form.Label>Select Financial Year</Form.Label>
            <FinancialYearOptions  selectedYearFromChild={handleYearChange}/>
          </Form.Group>

          <Form.Group as={Col} controlId="approvedBy">
            <Form.Label>Sanction Authority</Form.Label>
            <Form.Select value={approvedById} onChange={handleSanctionChange}required >
              <option value="">-- Select Authority --</option>
              <option value="1">Government Sanctions</option>
              <option value="2">O & M Committee</option>
              <option value="3">Chief Engineer</option>
              <option value="4">Superintending Engineer</option>
              <option value="5">Executive Engineer</option>
              <option value="6">Deputy Executive Engineer</option>
            </Form.Select>
          </Form.Group>
        </Row>

        {errorData && <Alert variant="danger">{errorData}</Alert>}

        <Table striped bordered hover size="sm" responsive>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Work Type</th>
              <th>Name of the Work</th>
              <th>Proceeding Number</th>
              <th>Administrative Amount</th>
              <th>Head of account</th>
              <th>Sanctioned Authority</th>
              <th>Financial Year</th>
              <th>Update</th>
               <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((item, idx) => (
                <tr key={item.workId || idx}>
                  <td align="center">{idx + 1}</td>
                  <td align="center">{item.workTypeName}</td>
                  <td align="center">{item.workName}</td>
                  <td align="center">{item.referenceNumber}</td>
                  <td align="center">{item.adminSanctionAmt}</td>
                  <td align="center">{item.headOfAccount}</td>
                  <td align="center">{item.approvedByName}</td>
                  <td align="center">{item.financialYear}</td>
                  <td align="center"><Button variant="primary" onClick={() => handleEditScreen(item.workId)}>Update</Button></td>
                  <td align="center"><Button variant="danger" onClick={() => handleDeleteScreen(item.workId)}>Delete</Button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} align="center">{approvedById && <em>No Data Found</em>} </td></tr> )}
          </tbody>
        </Table>
      </Form>
</Card.Body></Card>
    </div>
  )
}

export default AdminSanctionEdit;
