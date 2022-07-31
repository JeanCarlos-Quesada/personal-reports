import { Parameter } from "./database";

interface Report {
  name: string;
  scripts?: ScriptToExecute[];
}

interface ReportColumn {
  label: string;
  sqlName: string;
}

interface ReportData {
  result: any[];
  columns: ReportColumn[];
}

interface ScriptToExecute {
  name: string;
  script: string;
  dbName: string;
  dbType: string;
  initColumn: number;
  initRow: number;
  columns: ReportColumn[];
  parameters: Parameter[];
}

export { Report, ReportColumn, ReportData, ScriptToExecute };
