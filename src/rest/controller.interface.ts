import type { Router } from "express";

export interface Controller {
  getRouter(): Router;
}

