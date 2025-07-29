"use strict"
import express, { json, urlencoded } from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const router = await import("./src/routes/index.js");
import connectDB from "./db/dbconnect.js";

import dotenv from "dotenv";
dotenv.config(); 
connectDB(); 

// connectDB();
// const dotenv = await import("dotenv");
// dotenv.config({ quiet: true });

const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/start', (req, res) => {
    res.send(`<h1>Hello Weblock<h1/>`);
});

app.use(express.static(join(__dirname, "public")));
app.use("/api", router.default);

app.listen(port, () => {
    console.debug(`\x1b[32m✔ Server Started Successfully\x1b[0m \x1b[36m→ Now listening on Port: ${port}\x1b[0m`);
});