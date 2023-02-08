import fs from "fs";
import Excel from "exceljs";
import { Response } from "../interfaces/response";
import { Report, ScriptToExecute, ReportResult } from "../interfaces/reports";
import { BaseController } from "./baseController";

class ReportController extends BaseController {
  /* Creating a report and saving it to a file. */
  async createReport(req: any, res: any): Promise<Response> {
    const report = req.body as Report;

    const path = this._utilities.getBasePath();
    const directoryPath = `${path}\\reports`;
    const savePath = `${directoryPath}\\${
      report.basePath != null ? `${report.basePath}\\` : ""
    }${report.name}.json`;
    const jsonString = JSON.stringify(report);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdir(directoryPath, () => {
        console.log("Directory created!!!");
      });
    }

    const result = this._utilities.createFile(savePath, jsonString);

    const response: Response = {
      message: "",
      successfully: result,
      data: {},
    };

    return res.json(response);
  }

  async getReport(req: any, res: any): Promise<Response> {
    const { name } = req.query;

    const report = await this.getJsonReport(name);

    const response: Response = {
      message: "",
      successfully: true,
      data: report,
    };

    return res.json(response);
  }

  async getReports(req: any, res: any): Promise<Response> {
    let { baseDirectory } = req.body;

    const path = this._utilities.getBasePath();
    const directoryPath = `${path}reports\\${baseDirectory ?? ""}`;
    const files = await fs.readdirSync(directoryPath);

    const response: Response = {
      message: "",
      successfully: true,
      data: files,
    };

    return res.json(response);
  }

  async getReportData(req: any, res: any): Promise<Response> {
    const { report } = req.query;

    const reportSettings: Report = await this.getJsonReport(report);

    const data: ReportResult[] = [];

    for (const item of reportSettings.scripts) {
      await super.initConnection(item.dbName, item.dbType);

      const result: any[] = await this._connection.executeQuery(
        item.script,
        item.parameters
      );
      /* Replacing the key of the json object with the value of the label property and order by columns order. */
      const jsonResult: any = this._utilities.orderJsonReport(
        result,
        item.columns
      );

      data.push({
        initColumn: item.initColumn,
        initRow: item.initRow,
        data: jsonResult,
      });
    }

    const response: Response = {
      message: "",
      successfully: true,
      data,
    };

    return res.json(response);
  }

  async exportToExcel(req: any, res: any): Promise<Response> {
    const { name } = req.query;

    const reportSettings: Report = await this.getJsonReport(name);
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Countries List");

    await Promise.all(
      reportSettings.scripts.map(async (item: ScriptToExecute) => {
        await super.initConnection(item.dbName, item.dbType);

        const result: any[] = await this._connection.executeQuery(
          item.script,
          item.parameters
        );

        /* Creating a excel file. */
        for (let y = item.initColumn - 1; y < item.columns.length; y++) {
          worksheet.getRow(1).getCell(y + 1).value = item.columns[y].label;
        }

        for (let x = item.initRow - 1; x < result.length; x++) {
          const row = worksheet.getRow(x + 2);
          for (let y = item.initColumn - 1; y < item.columns.length; y++) {
            row.getCell(y + 1).value = result[x][item.columns[y].sqlName];
          }
        }
      })
    );
    const buffer = await workbook.xlsx.writeBuffer();

    const response: Response = {
      message: "",
      successfully: true,
      data: {
        fileName: `${reportSettings.name}.xlsx`,
        buffer,
      },
    };

    return res.json(response);
  }

  //#region privateFunctions
  private async getJsonReport(name: string): Promise<Report> {
    const path = this._utilities.getBasePath();
    const directoryPath = `${path}\\reports`;
    const savePath = `${directoryPath}\\${name}.json`;

    const report = await this._utilities.readJSONFile(savePath);

    return report;
  }
  //#endregion privateFunctions
}

export { ReportController };
