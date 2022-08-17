import fs from "fs";
import { SqlServerRow } from "../interfaces/sqlServerResult";
import { ReportColumn } from "../interfaces/reports";

class Utilities {
  getBasePath(): string {
    const path = __dirname.replace("utilities", "");

    return path;
  }

  /**
   * It reads a JSON file and returns the parsed JSON object.
   * @param path - The path to the file you want to read.
   * @returns The result of the JSON.parse() function.
   */
  async readJSONFile(path: string): Promise<any> {
    const jsonString = await fs.readFileSync(path);
    const result = JSON.parse(jsonString.toString());
    return result;
  }

  /**
   * It creates a file at the specified path with the specified data
   * @param {string} path - The path to the file you want to create.
   * @param {string | NodeJS.ArrayBufferView} data - The data to write to the file, specified as a
   * string, Buffer, or Uint8Array object.
   * @returns A boolean value.
   */
  createFile(path: string, data: string | NodeJS.ArrayBufferView): boolean {
    try {
      fs.writeFileSync(path, data);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * It takes a the sql server result and convert it to json object [{columnName: value}]
   * @param {SqlServerRow[][]} sqlResult - SqlServerRow[][] - This is the result of the query.
   * @returns An array of objects.
   */
  convertSqlServerResultToJSON(sqlResult: SqlServerRow[][]): any[] {
    const result: any[] = [];

    sqlResult.map((row: SqlServerRow[]): void => {
      const rowData: any = {};
      row.map((data: SqlServerRow) => {
        rowData[data.metadata.colName] = data.value;
      });
      result.push(rowData);
    });

    return result;
  }

/**
 * It takes a JSON object and an array of ReportColumn objects and returns a new JSON object with the
 * same data but with the keys in the order specified by the ReportColumn array.
 *
 * The ReportColumn object has two properties: label and sqlName. The label property is the name of the
 * key in the new JSON object. The sqlName property is the name of the key in the original JSON object.
 * @param {any} json - any - this is the json data that you want to order
 * @param {ReportColumn[]} columns - ReportColumn[]
 * @returns An array of objects.
 */
  orderJsonReport(json: any, columns: ReportColumn[]): any {
    const result: any[] = [];
    json.forEach((row: any) => {
      const dataRow: any = {};
      columns.forEach(({ label, sqlName }) => {
        dataRow[label] = row[sqlName];
      });
      result.push(dataRow);
    });
    return result;
  }
}

export default Utilities;
