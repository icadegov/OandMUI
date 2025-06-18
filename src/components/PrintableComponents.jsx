import React from 'react'
import printJS from "print-js";
import { Button } from 'react-bootstrap';
const PrintableComponents =({data,columns,type,header}) => {
  const handlePrint = () => {
    // printJS({
    //   printable: data, // JSON data
    //  // properties: columns, // Columns to print
    //   properties:columns,
    //   type: type,
    //   header:header, // Title
    // });
    printJS({
      header: header,
      printable: data,
     // printable: 'print-area',
         type: type,
         style: "table { border-collapse: collapse; margin top: 20px;} th, td { border: 1px solid black; padding: 3px; text-align: center; }",
       
       });
  };

  const handleJSONPrint=()=>{
    printJS({
      printable: data, // JSON data
      properties: columns, // Columns to print
      type: type,
      header:header, // Title
      style: "table { border-collapse: collapse; margin top: 20px;} th, td { border: 1px solid black; padding: 3px; text-align: center; }",
    });
  }
  return (
    <div >
  <Button  variant="outline-primary"
        onClick={type==="json"?handleJSONPrint:handlePrint}>
        Print
      </Button>
  </div>
  );
}

export default PrintableComponents