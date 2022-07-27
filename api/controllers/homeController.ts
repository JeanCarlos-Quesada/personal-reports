import { Response } from "../interfaces/response";

class HomeController {
  OnLogin = async (req: any, res: any): Promise<any> => {
    const response: Response = {
      message: "",
      successfully: true,
      data: {},
    };

    return res.json(response);
  };
}

export { HomeController };
