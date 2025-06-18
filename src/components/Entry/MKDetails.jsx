import React from 'react'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import MKServies from '../../services/MKService';

const MKDetails = ({selectedTankFromChild}) => {
const [mkDistricts,setmkDistricts]=useState([]);
const [selMKDistrict,setselMKDistrict]=useState();
const [mkMandals,setmkMandals]=useState();
const [selMKMandal,setselMKMandal]=useState();
const [mkVillages,setmkVillages]=useState([]);
const [selMKVillage,setselMKVillage]=useState();
const [tanks,setTanks]=useState([]);
const [selTanks,setselTanks]=useState();


useEffect(() => {
    MKServies.getdistricts((response) => {
        setmkDistricts(response.data.data);
      }, (error) => {
        console.log(error);
      })
  }, [])
  

    const handleDistrictChange = (event) => {
  setmkMandals([]);
  setmkVillages([]);
  const selectedDistrict = event.target.value;
  setselMKDistrict(selectedDistrict);
  MKServies.getMandals({params : { dcode:selectedDistrict }}, (response) => {
    setmkMandals(response.data.data);
  }, (error) => {
    console.log(error);
  })
}

const handleMandalChange = (event) => {
  setmkVillages([]);
  const selectedMandal = event.target.value;
  setselMKMandal(selectedMandal);
  MKServies.getVillages({ dcode:selMKDistrict ,mcode:selectedMandal }, (response) => {
    setmkVillages(response.data.data);
  }, (error) => {
    console.log(error);
  })
}

const handleVillageChange=(event)=>{
  const selectedVillage = event.target.value;
  setselMKVillage(selectedVillage);
  MKServies. getTanks({dcode:selMKDistrict ,mcode:selMKMandal ,vcode:selectedVillage}, (response) => {
    setTanks(response.data.data);
   // selTankDetails(response.data.data);
  }, (error) => {
    console.log(error);
  })
}

const handleTankChange=(event)=>{ 
  const selectedTank = event.target.value;
  const selectedTankObj = tanks.find(tank => String(tank.tankId) === selectedTank);
  const data={tankId:selectedTankObj.tankId,tankCode:selectedTankObj.tankCode,tankName:selectedTankObj.tankName};
  setselTanks(selectedTank);
  selectedTankFromChild(data);
}

  return (
    <div>
        <Row className="mb-3">
      <Form.Group as={Col} controlId="formGridFinYear" >
    <Form.Label>Select District</Form.Label>
    {mkDistricts && <Form.Select value={selMKDistrict} onChange={handleDistrictChange}>
<option value="">Select </option>
{mkDistricts && mkDistricts.map((district) => (
<option key={district.distID} value={district.districtCode}>
{district.districtName}
</option>
))}
</Form.Select>}
    </Form.Group>

    <Form.Group as={Col} controlId="formGridFinYear" >
    <Form.Label>Select Mandals</Form.Label>
    {mkMandals && 
    <Form.Select value={selMKMandal} onChange={handleMandalChange}>
<option value="">Select </option>
{mkMandals.map((mandal) => (
<option key={mandal.mandalCode} value={mandal.mandalCode}>
{mandal.mandalName}
</option>
))}
</Form.Select>}
    </Form.Group>

 
    <Form.Group as={Col} controlId="formGridFinYear" >
    <Form.Label>Select Villages</Form.Label>
    {mkVillages && <Form.Select value={selMKVillage} onChange={handleVillageChange}>
<option value="">Select </option>
{mkVillages.map((village) => (
<option key={village.villageCode} value={village.villageCode}>
{village.villageName}
</option>
))}
</Form.Select>}
    </Form.Group>


    <Form.Group as={Col} controlId="formGridFinYear" >
    <Form.Label>Select Tank</Form.Label>
    {tanks && <Form.Select value={selTanks} onChange={handleTankChange}>
    <option value="">Select </option>
{tanks.map((tank) => (

<option key={tank.tankId} value={tank.tankId}>
{tank.tankCode + " : " + tank.tankName}
</option>
))}
</Form.Select>}
    </Form.Group>
    </Row>
    </div>
  )
}

export default MKDetails