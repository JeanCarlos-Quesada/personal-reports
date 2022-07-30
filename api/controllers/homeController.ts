import { Response } from "../interfaces/response";
import { DbConnection } from "../utilities/dbConnection";
import Utilities from "../utilities/utilities";

class HomeController {
  constructor() {
    this.utilities = new Utilities();
    this.connection = new DbConnection();
  }

  private utilities: Utilities;
  private connection: DbConnection;
}

export { HomeController };
