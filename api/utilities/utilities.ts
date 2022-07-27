import fs from "fs";

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
}

export default Utilities;
