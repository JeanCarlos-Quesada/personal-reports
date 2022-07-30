import { Response } from "../interfaces/response";
import { Report, ReportColumn, ReportData } from "../interfaces/reports";
import { BaseController } from "./baseController";

class ReportController extends BaseController {
  async createReport(req: any, res: any): Promise<Response> {
    const response: Response = {
      message: "",
      successfully: true,
      data: {},
    };

    return res.json(response);
  }

  async getReport(req: any, res: any): Promise<Response> {
    const response: Response = {
      message: "",
      successfully: true,
      data: {},
    };

    return res.json(response);
  }

  async getReportData(req: any, res: any): Promise<Response> {
    const { query, params, dbName, dbType } = req.body;
    /*Get report settings*/
    const report: Report = {
      columns: [
        {
          label: "ID",
          sqlName: "id",
        },
      ],
      data: [],
    };

    /*Create connection Class*/
    await super.initConnection(dbName, dbType);

    /*Execute query*/
    const result: ReportData[] = await this._connection.executeQuery(
      query,
      params
    );

    /* Replacing the key of the json object with the value of the label property. */
    report.columns.map((columnSettings: ReportColumn) => {
      this._utilities.replaceJsonKey(
        result,
        columnSettings.sqlName,
        columnSettings.label
      );
    });

    const response: Response = {
      message: "",
      successfully: true,
      data: result,
    };

    return res.json(response);
  }

  async exportToExcel(req: any, res: any): Promise<Response> {
    const response: Response = {
      message: "",
      successfully: true,
      data: {},
    };

    return res.json(response);
  }

  async exportToJSON(req: any, res: any): Promise<Response> {
    const response: Response = {
      message: "",
      successfully: true,
      data: {},
    };

    return res.json(response);
  }
}

export { ReportController };
