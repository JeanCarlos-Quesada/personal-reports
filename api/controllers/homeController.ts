import { Response } from "../interfaces/response";
import { DbConnection } from "../utilities/dbConnection";

class HomeController {
  OnLogin = async (req: any, res: any): Promise<any> => {
    /*Create connection Class*/
    const connection = await new DbConnection().initConnection({ dbType: "mysql", dbName: "test" });
    /*Execute query*/
    connection.executeQuery("select * from cartproducts", []).then((result) => {
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
