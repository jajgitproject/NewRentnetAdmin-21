// @ts-nocheck
import * as XLSX from 'xlsx';
import { TableElement } from './TableElement';

const getFileName = (name: string) => {
  const timeSpan = new Date().toISOString().replace(/[:.]/g, '-');
  const rawSheetName = name || 'ExportResult';
  const sheetName = rawSheetName.length > 31 ? rawSheetName.substring(0, 31) : rawSheetName;
  const fileName = `${rawSheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName,
  };
};
export class TableExportUtil {
  static exportToExcel(arr: Partial<TableElement>[], name: string) {
    const { sheetName, fileName } = getFileName(name);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  // static exportToPDF(exportData: any[]) {
  //   const doc = new jsPDF();
  //   const dataValue: any = Object.keys(exportData).map(function (
  //     personNamedIndex: any
  //   ) {
  //     return Object.values(exportData[personNamedIndex]);
  //   });
  //   const keys: any = Object.keys(exportData[0]);

  //   autoTable(doc, {
  //     head: [keys],
  //     body: dataValue,
  //   });

  //   const { fileName } = getFileName('pdf');

  //   doc.save(`${fileName}.pdf`);
  // }
}

