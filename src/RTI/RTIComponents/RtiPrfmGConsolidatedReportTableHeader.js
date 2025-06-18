import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';

const RtiPrfmGConsolidatedReportTableHeader = ({ cellStyle }) => {
      const row1Ref = useRef(null);
    const row2Ref = useRef(null);
   const [rowHeights, setRowHeights] = useState({ row1: 0, row2: 0, row3: 0 });
  
    useEffect(() => {
      const row1Height = row1Ref.current?.getBoundingClientRect().height || 0;
      const row2Height = row2Ref.current?.getBoundingClientRect().height || 0;
      setRowHeights({ row1: row1Height, row2: row2Height });
      // onMeasure?.({ row1: row1Height, row2: row2Height});
    }, []);
  return (
      <thead style={{ backgroundColor: "#d3d8e2", color: "white" }}> 
          
           <tr ref={row1Ref}>   
                  <th className="sticky-header"rowspan="2" style={{ top: 0, position: 'sticky' }}  align="center" width="3%" >Sl No.</th>
                  <th className="sticky-header"rowspan="2" style={{ top: 0, position: 'sticky' }} align="center" width="15%" >Name & Address of the HOD/HOP/Unit</th> 
                  <th className="sticky-header" rowspan="2" style={{ top: 0, position: 'sticky' }} align="center" width="5%" >Total No. of AA's in District & Regional/Zonal & HOD</th> 
                  <th className="sticky-header" rowspan="2" style={{ top: 0, position: 'sticky' }} align="center" width="5%">Total No. of appeals pending as on end of the last Quarter</th> 
                  <th className="sticky-header" rowspan="2" style={{ top: 0, position: 'sticky' }} align="center" width="5%">Total No. of appeals received during the Quarter</th>
                  <th className="sticky-header" rowspan="2" style={{ top: 0, position: 'sticky' }} width="5%">Total (Cols. 4+5)</th>
                  <th className="sticky-header" rowspan="2" style={{ top: 0, position: 'sticky' }}  align="center" width="5%">Total No. of appeals disposed during the Quarter</th> 
                  <th className="sticky-header" rowspan="2" style={{ top: 0, position: 'sticky' }}  align="center" width="5%">Total No. of  appeals pending </th>  
                  <th className="sticky-header" rowspan="2" style={{ top: 0, position: 'sticky' }} align="center" width="6%">Out of cases Disposed shown in Col. 7 Information furnished</th> 
                  <th className="sticky-header" colspan="15" style={{ top: 0, position: 'sticky' }} align="center" width="45%">Out of cases disposed shown in Col. No. 7, Cases rejected under sections</th> 
                   <th className="sticky-header" rowspan="2" style={{ top: 0, position: 'sticky' }} align="center" width="8%">Amount of Total Application Fee and charges collected for furnishing information </th> 
             </tr>
      <tr ref={row2Ref}>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">6</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(a)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(b)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(c)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(d)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(e)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(f)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(g)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(h)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(i)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">8(1)(j)</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">9</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">11</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">24</th>
        <th className="sticky-header" style={{ top: rowHeights.row1, position: 'sticky' }} align="center">other</th>
      </tr>
      <tr>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">1</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">2</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">3</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">4</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">5</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">6</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">7</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">8</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">9</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">10</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">11</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">12</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">13</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">14</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">15</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">16</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">17</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">18</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">19</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">20</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">21</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">22</th>
        <th className="sticky-header"  style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">23</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">24</th>
        <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }} align="center">25</th>
      </tr>
    </thead>
  );
};

export default RtiPrfmGConsolidatedReportTableHeader;
