import React from 'react'
import { useState, useEffect } from 'react';
import AdminSanctionService from '../../services/AdminSanctionService'
import Form from 'react-bootstrap/Form';

function WorkType({selWorkTypeFromChild}) {
    const [workType, setworkType] = useState([]);
    const [selectedWorkType, setSelectedWorkType] = useState(""); 
useEffect(() => {
  AdminSanctionService.getworkType((response) => {
        setworkType(response.data.data);
  }, (error) => {
    console.log(error);
  })
}, [])

const handleChange = (event) => {
  setSelectedWorkType(event.target.value);
  selWorkTypeFromChild(event.target.value);
}
  return (
    <Form.Select value={selectedWorkType} onChange={handleChange}>
    <option value="">Select </option>
    {workType.map((workType) => (
      <option key={workType.workTypeId} value={workType.workTypeId}>
        {workType.workTypeName}
      </option>
    ))}
  </Form.Select>
  )
}

export default WorkType