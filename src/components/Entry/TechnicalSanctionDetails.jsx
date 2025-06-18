import React from 'react'

import { useState,useEffect} from 'react';
import Select from "react-select";
import TechnicalSanctionService from '../../services/TechnicalSanctionService'
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

export const TechnicalSanctionDetails = ({workId,selectTechIdFromChild}) => {

    const [techId, setTechId] = useState(null);
    const [items, setitems] = useState(null);
    const [error, seterror] = useState(null);

    const handleChange=(option)=>{
        setTechId(option);
        selectTechIdFromChild(option.value)
    }

    const getSelectItems = () => {
    
      TechnicalSanctionService.technicalSanctionsByworkId({
      params: {
        workId:workId,
      }
    }, (response) => {
      //console.log("response.data"+ response.data);
      const selectOptions = response.data.data.map(items => ({
        value: items.tsId,
        label: items.tsNumber
      }));
      
      setitems(selectOptions);

       if (!response || response.data.data.length === 0) {
                seterror(  "No TS Found!! Please Submit Technical Sanction" );
             } else {
                seterror(null); // clear old errors
              }

    }, (error) => {

      console.log(error);
    })
  };
    
    useEffect(() => {
        getSelectItems();
    }, []); 

  return (

 <Row className="mb-3 d-flex justify-content-center align-items-center">

               <> { items &&  <Select value={techId} options={items} isSearchable={true} 
    placeholder="Select Technical Sanction"   onChange={handleChange}></Select>}</>

{error && (
  <Form.Text className="text-danger">
    {error}
  </Form.Text>
)}
            </Row>
    
   
    
  )
}
