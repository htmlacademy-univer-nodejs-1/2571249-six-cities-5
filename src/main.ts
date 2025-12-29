import "reflect-metadata";
import dotenv from "dotenv";
import { createContainer } from "./core/container.js";
import { Service } from "./core/service.js";
import type { Application } from "./core/application.js";

dotenv.config();

const container = createContainer();
const application = container.get<Application>(Service.Application);

application.init();
