interface Report {
  columns: ReportColumn[];
  data: ReportData[];
}

interface ReportColumn {
  label: string;
  sqlName: string;
}

interface ReportData {
  name: string;
  value: any;
}

export { Report, ReportColumn, ReportData };
