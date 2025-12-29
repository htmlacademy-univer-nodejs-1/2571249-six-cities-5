import type { Router } from "express";

export interface Route {
  getPath(): string;
  getRouter(): Router;
}

