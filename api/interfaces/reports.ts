import { Parameter } from "./database";

interface Report {
  name: string;
  scripts?: ScriptToExecute[];
}

interface ReportColumn {
  label: string;
  sqlName: string;
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

interface ReportResult {
  initColumn: number;
  initRow: number;
  data: any[];
}

export { Report, ReportColumn, ScriptToExecute,ReportResult };
