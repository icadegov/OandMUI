import React from 'react';

import { useState,useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Select from "react-select"
import { useNavigate } from 'react-router-dom';
import AgreementService from '../../services/AgreementService';
export const AgreementDetails = ({workId,selectagmtIdFromChild}) => {

    const [agreementId, setAgreementId] = useState(null);
    const [items, setitems] = useState(null);
    const [error, seterror] = useState(null);

       const navigate = useNavigate();
    const handleChange=(option)=>{
        setAgreementId(option);
        selectagmtIdFromChild(option.value)
    }

      const getSelectItems = () => {
    
      AgreementService.getAgreementsByworkId({
      params: {
        workId:workId,
      }
    }, (response) => {
      //console.log("response.data"+ response.data);
      const selectOptions = response.data.data.map(items => ({
       value: items.agreementId,
       label: items.agreementNumber
      }));
      
      setitems(selectOptions);

       if (!response || response.data.data.length === 0) {
                seterror(  "Please Submit Agreement Details" );
             } else {
                seterror(null); // clear old errors
              }

    }, (error) => {
console.error('Error Getting Data:', error);
            if(error.status === 401 || error.status === 403 || error.status === 404){navigate('/')}
    })
  };


    useEffect(() => {
        getSelectItems();
    }, [workId]); 

  return (
    
    <Row className="mb-3 d-flex justify-content-center align-items-center">

               <> { items &&  <Select value={agreementId} options={items} isSearchable={true} 
     placeholder="Select Agreement"   onChange={handleChange}></Select>}</>

{error && (
  <Form.Text className="text-danger">
    {error}
  </Form.Text>
)}
            </Row>
    
  )
}


