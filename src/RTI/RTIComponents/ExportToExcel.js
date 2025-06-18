import React from 'react';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

const ExportToExcel = ({ tableId, filename = 'export.xlsx', sheetName = 'Sheet1', buttonLabel = 'Export to Excel' }) => {
  const exportTableToExcel = () => {
    const table = document.getElementById(tableId);

    if (!table) {
      console.error(`Table with ID '${tableId}' not found`);
      return;
    }

    let data = [];
    let merges = [];
    let cellMap = [];

    const headerRows = table.querySelectorAll('thead tr');

    headerRows.forEach((row, rowIndex) => {
      let rowHeaders = [];
      let colIndex = 0;

      row.querySelectorAll('th').forEach((cell) => {
        if (cell.style.display === 'none') return;

        while (cellMap[rowIndex] && cellMap[rowIndex][colIndex]) colIndex++;

        let rowSpan = parseInt(cell.getAttribute('rowSpan') || '1', 10);
        let colSpan = parseInt(cell.getAttribute('colSpan') || '1', 10);

        rowHeaders[colIndex] = cell.innerText.trim();

        for (let r = 0; r < rowSpan; r++) {
          for (let c = 0; c < colSpan; c++) {
            if (!cellMap[rowIndex + r]) cellMap[rowIndex + r] = [];
            cellMap[rowIndex + r][colIndex + c] = true;
          }
        }

        if (rowSpan > 1 || colSpan > 1) {
          merges.push({
            s: { r: rowIndex, c: colIndex },
            e: { r: rowIndex + rowSpan - 1, c: colIndex + colSpan - 1 },
          });
        }

        colIndex += colSpan;
      });

      data.push(rowHeaders);
    });

    const rows = table.querySelectorAll('tbody tr');
    const totalRowIndex = rows.length - 1;

    rows.forEach((row, rowIndex) => {
      let rowData = [];
      let colIndex = 0;

      row.querySelectorAll('td').forEach((cell) => {
        if (cell.style.display === 'none') return;

        while (cellMap[rowIndex + headerRows.length] && cellMap[rowIndex + headerRows.length][colIndex]) colIndex++;

        let rowSpan = parseInt(cell.getAttribute('rowSpan') || '1', 10);
        let colSpan = parseInt(cell.getAttribute('colSpan') || '1', 10);

        rowData[colIndex] = cell.innerText.trim();

        for (let r = 0; r < rowSpan; r++) {
          for (let c = 0; c < colSpan; c++) {
            if (!cellMap[rowIndex + headerRows.length + r]) cellMap[rowIndex + headerRows.length + r] = [];
            cellMap[rowIndex + headerRows.length + r][colIndex + c] = true;
          }
        }

        if (rowSpan > 1 || colSpan > 1) {
          merges.push({
            s: { r: rowIndex + headerRows.length, c: colIndex },
            e: { r: rowIndex + headerRows.length + rowSpan - 1, c: colIndex + colSpan - 1 },
          });
        }

        colIndex += colSpan;
      });

      data.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!merges'] = merges;

    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;
        if (!ws[cell_ref].s) ws[cell_ref].s = {};

        // Add borders
        ws[cell_ref].s.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Center align
        ws[cell_ref].s.alignment = { horizontal: 'center', vertical: 'center' };

        // Bold header and total row
        if (R < headerRows.length || R === totalRowIndex + headerRows.length) {
          ws[cell_ref].s.font = { bold: true };
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, filename);
  };

  return (
    <button onClick={exportTableToExcel}>
      {buttonLabel}
    </button>
  );
};

export default ExportToExcel;
