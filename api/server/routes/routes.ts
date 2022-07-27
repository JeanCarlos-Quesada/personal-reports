import { Router } from "express";
const router = Router();

import { HomeController } from "../../controllers/homeController";

class Routes {
  constructor() {
    this.homeController = new HomeController();
  }

  private homeController: HomeController;

  routes = () => {
    router.get("/", this.homeController.OnLogin);
    return router;
  };
}

export { Routes };
