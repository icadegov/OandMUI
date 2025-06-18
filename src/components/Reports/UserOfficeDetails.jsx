import React from 'react'
import UserService from '../../services/UserService'

const UserOfficeDetails = ({unit,circle,division,subdivision}) => {

const [circle,setCircle]=useState([]);

UserService.getCirclesByUnitId(unit, (response) => { setCircle(response.data.data) }, (error) => { console.log(error) });


  return (
    <div>UserOfficeDetails</div>
  )
}

export default UserOfficeDetails