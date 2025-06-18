import React, { useEffect, useRef, useState } from 'react';


const RtiAppConsolidatedReportTableHeader = ({ cellStyle }) => {
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
     <thead>
      <tr ref={row1Ref}>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="2%">Sl No.</th>
        <th className="first-header" rowSpan="2"  style={{ top: 0, position: 'sticky' }} width="10%">Name of the Districts & Regional / Zonal Offices & HOD</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="5%">Total No. of PIOs in each District & Regional / Zonal & HOD</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="5%">Total No. of applications pending as on end of last Quarter</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="5%">Total No. of applications received during the Quarter</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="3%">Total (Cols. 4+5)</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="5%">Total No. of applications disposed during the Quarter</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="5%">Total No. of Applications pending (Cols. 6-7)</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="5%">Out of cases Disposed shown in Col. 7 Information furnished</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="5%">Out of cases Disposed shown in Col. 7 Deemed Refusals u/s 7(2)/18(1)</th>
        <th className="first-header" colSpan="15" style={{ top: 0, position: 'sticky' }} width="45%">Out of cases disposed shown in Col. No. 7, Cases rejected under sections</th>
        <th className="first-header" rowSpan="2" style={{ top: 0, position: 'sticky' }} width="5%">Amount of Total Application Fee and charges collected for furnishing information</th>
      </tr>
      <tr ref={row2Ref}>
        {["6", "8(1)(a)", "8(1)(b)", "8(1)(c)", "8(1)(d)", "8(1)(e)", "8(1)(f)", "8(1)(g)", "8(1)(h)", "8(1)(i)", "8(1)(j)", "9", "11", "24", "other"].map((item, index) => (
          <th className="second-header" key={index} style={{ top: rowHeights.row1, position: 'sticky' }}>{item}</th>
        ))}
      </tr>
      <tr>
        {Array.from({ length: 26 }, (_, i) => (
          <th className="third-header"  key={i}  style={{ top: rowHeights.row1 + rowHeights.row2, position: 'sticky' }}>{i + 1}</th>
        ))}
      </tr>
    </thead>
  );
};

// const cellStyle = {
//   border: "2px solid #D3D3D3",
//   textAlign: "center",
//   wordWrap: "break-word"
// };


export default RtiAppConsolidatedReportTableHeader;
