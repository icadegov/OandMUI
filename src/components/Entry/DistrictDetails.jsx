import React from 'react'
import PMSService from '../../services/PMSService';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import Select from "react-select"

const DistrictDetails = ({type, selDistrictDetFromChild }) => {

  const [districts, setdistricts] = useState([]);
  const [seldistrict, setselDistrict] = useState();
  const [mandals, setMandals] = useState([]);
  const [selMandal, setselMandal] = useState();
  const [villages, setVillages] = useState([]);
  const [multiplevillages, setmultipleVillages] = useState([]);
  const [selVillage, setselVillage] = useState();

  const [loading, setLoading] = useState({
    districts: false,
    mandals: false,
    villages: false
  });

  useEffect(() => {
    setLoading(prev => ({ ...prev, districts: true }));
    PMSService.getDistrcits((response) => {
      setdistricts(response.data.data);
      setLoading(prev => ({ ...prev, districts: false }));
    }, (error) => {
      setLoading(prev => ({ ...prev, districts: false }));
      console.log(error);
    })
  }, [])

  const handleDistrictChange = (event) => {
    setMandals([]);
    setVillages([]);
    setmultipleVillages([]);
    setLoading(prev => ({ ...prev, mandals: true }));
    const selectedDistrict = event.target.value;
   
    setselDistrict(selectedDistrict);
    PMSService.getMandals(selectedDistrict, (response) => {
      setLoading(prev => ({ ...prev, mandals: false }));
      setMandals(response.data.data);
    }, (error) => {
      setLoading(prev => ({ ...prev, mandals: false }));
      console.log(error);
    })
  }

  const handleMandalChange = (event) => {
    setVillages([]);
    setmultipleVillages([]);
    setLoading(prev => ({ ...prev, villages: true }));
    const selectedMandal = event.target.value;
    setselMandal(selectedMandal);
    PMSService.getVillages(selectedMandal, (response) => {
      setLoading(prev => ({ ...prev, villages: false }));
      setVillages(response.data.data);

      const villageOptions = response.data.data?.map((village) => ({
        value: village.villageId,
        label: village.villageName
      })) || [];
      setmultipleVillages(villageOptions);
    }, (error) => {
      setLoading(prev => ({ ...prev, villages: false }));
      console.log(error);
    })
  }

  const handleVillageChange = (event) => {
    const selectedVillage = event.target.value;
    setselVillage(selectedVillage);
    selDistrictDetFromChild(seldistrict, selMandal, selectedVillage);
  }

  const handleMultipleVillageChange=(event)=>{
    //const selectedVillage = event.map((village) => ()=>(village.value,village.label));
    const selectedVillage = event.map(village => ({
      districtId: seldistrict,
      mandalId: selMandal,
      villageId: village.value,
      benefitedVname: village.label
    }));
    setselVillage(selectedVillage);
    selDistrictDetFromChild(selectedVillage);
  }

  return (
    <Row className="mb-3">
      <Col md={3}>
      <Form.Group as={Row} controlId="formGridFinYear" >
        <Col sm={5}>
        <Form.Label column>Select District</Form.Label></Col>
        <Col sm={7}>
        <Form.Select disabled={loading.districts} value={seldistrict} onChange={handleDistrictChange}>
          {loading.districts ? (
            <option>Loading...</option>
          ) : (
            <>
              <option value="">Select</option>
              {districts.map((district) => (
                <option key={district.districtId} value={district.districtId}>
                  {district.districtName}
                </option>
              ))}
            </>
          )}
        </Form.Select>
        </Col>
      </Form.Group>
</Col>
<Col md={3}>

      <Form.Group as={Row} controlId="formGridFinYear" >
        <Col sm={5}>
        <Form.Label column>Select Mandals</Form.Label></Col>
        <Col sm={7}>
        <Form.Select disabled={loading.mandals} value={selMandal} onChange={handleMandalChange}>
          {loading.mandals ? (
            <option>Loading...</option>
          ) : (<> <option value="">Select </option>
            {mandals.map((mandal) => (
              <option key={mandal.mandalId} value={mandal.mandalId}>
                {mandal.mandalName}
              </option>
            ))} </>
          )}



        </Form.Select>
        </Col>
      </Form.Group>
      </Col>
{type==="single"  && 

<><Col md={3}> <Form.Group as={Row} controlId="formGridFinYear" >
        <Col sm={5}><Form.Label column>Select Village</Form.Label></Col>
        <Col sm={7}>
         <Form.Select disabled={loading.villages} value={selVillage} onChange={handleVillageChange}>
{loading.villages ? (
            <option>Loading...</option>
          ) : ( <><option value="">Select </option>
            {villages && villages.map((villages) => (
              <option key={villages.villageId} value={villages.villageId}>
                {villages.villageName}
              </option>
            ))} </>
)}

         
        </Form.Select>
        </Col>
      </Form.Group></Col></>
}
     
{type==="multiple" && <><Col><Form.Group as={Row} controlId="formGridFinYear" >
        <Col sm={2}><Form.Label column>Select Village</Form.Label></Col>
        <Col sm={10}>
        <Select options={multiplevillages} isMulti onChange={handleMultipleVillageChange} isDisabled={loading.villages}></Select></Col>
      </Form.Group></Col></>}
      

    </Row>

  )
}

export default DistrictDetails