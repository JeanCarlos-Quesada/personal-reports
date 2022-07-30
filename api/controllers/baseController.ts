import { DbConnection } from "../utilities/dbConnection";
import Utilities from "../utilities/utilities";

class BaseController {
  constructor() {
    this._utilities = new Utilities();
    this._connection = new DbConnection();
  }

  protected _utilities: Utilities;
  protected _connection: DbConnection;

  protected async initConnection(name: string, type: string): Promise<void> {
    this._connection = await this._connection.initConnection({
      dbType: type,
      dbName: name,
    });
  }
}

export { BaseController };
