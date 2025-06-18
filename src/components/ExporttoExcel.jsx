import React from 'react'

import * as XLSX from "xlsx";
import Button from 'react-bootstrap/Button';

const ExporttoExcel = ({tableData,fileName}) => {

const handleExport=()=>{
if(!tableData || tableData.length===0){
return;
}
const worksheet=XLSX.utils.json_to_sheet(tableData);
const workbook= XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook,worksheet,"Sheet1");
XLSX.writeFile(workbook,`${fileName}.xlsx`);
}
  return (
    <div>
          <Button variant="outline-warning" onClick={handleExport}>
               Download Excel
              </Button>

    </div>
  )
}

export default ExporttoExcel