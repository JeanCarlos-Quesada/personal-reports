import fs from "fs";
import { SqlServerRow } from "../interfaces/sqlServerResult";

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
   * It takes a JSON object, an old key, and a new key, and returns a new JSON object with the old key
   * replaced by the new key
   * @param {any} json - any - the json object you want to replace the key in only JSON array
   * @param {string} oldKey - The key you want to replace
   * @param {string} newKey - The new key you want to replace the old key with.
   * @returns the json object with the new key.
   */
  replaceJsonKey(json: any, oldKey: string, newKey: string): void {
    if (oldKey !== newKey) {
      json.map((item: any) => {
        item[newKey] = item[oldKey];
        delete item[oldKey];
      });
    }
  }
}

export default Utilities;
