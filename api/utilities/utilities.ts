import fs from "fs";
import { SqlServerRow } from "../interfaces/sqlServerResult";

class Utilities {
  /**
   * It reads a JSON file and returns the parsed JSON object.
   * @param path - The path to the file you want to read.
   * @returns The result of the JSON.parse() function.
   */
  readJSONFile = async (path: string): Promise<any> => {
    const jsonString = await fs.readFileSync(path);
    const result = JSON.parse(jsonString.toString());
    return result;
  };

  /**
   * It takes a the sql server result and convert it to json object [{columnName: value}]
   * @param {SqlServerRow[][]} sqlResult - SqlServerRow[][] - This is the result of the query.
   * @returns An array of objects.
   */
  convertSqlServerResultToJSON(sqlResult: SqlServerRow[][]): any {
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
}

export default Utilities;
