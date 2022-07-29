import { Response } from "../interfaces/response";
import { DbConnection } from "../utilities/dbConnection";

class HomeController {
  OnLogin = async (req: any, res: any): Promise<any> => {
    const connection = await new DbConnection().initConnection({ dbType: "sqlserver", dbName: "tes" });
    connection.executeQuery("select * from cartProducts", []).then((result) => {
      const response: Response = {
        message: "",
        successfully: true,
        data: result,
      };

      return res.json(response);
    });
  };
}

export { HomeController };
