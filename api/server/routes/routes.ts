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
    router.post("/Reports/Create", (req, res) => {
      this.reportController.createReport(req, res);
    });

    router.get("/Reports/Read", (req, res) => {
      this.reportController.getReport(req, res);
    });

    router.get("/Reports/All", (req, res) => {
      this.reportController.getReports(req, res);
    });

    router.get("/Reports/GetData", (req, res) => {
      this.reportController.getReportData(req, res);
    });

    router.get("/Reports/ExportExcel", (req, res) => {
      this.reportController.exportToExcel(req, res);
    });

    return router;
  }
}

export { Routes };
