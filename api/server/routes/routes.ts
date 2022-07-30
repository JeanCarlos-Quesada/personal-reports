import { Router } from "express";
const router = Router();

import { HomeController } from "../../controllers/homeController";
import { ReportController } from "../../controllers/reportsController";

class Routes {
  constructor() {
    this.homeController = new HomeController();
    this.reportController = new ReportController();
  }

  private homeController: HomeController;
  private reportController: ReportController;

  routes() {
    router.get("/", (req, res) => {
      this.reportController.getReportData(req, res);
    });
    return router;
  }
}

export { Routes };
