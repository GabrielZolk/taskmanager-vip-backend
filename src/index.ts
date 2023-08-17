import express from "express";
import admin from 'firebase-admin';
import cors from 'cors';
import { tasksRouter } from "./routes/indexRouter";

const app = express();

const PORT = process.env.PORT || 3000

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());
app.use(cors());

app.use('/', tasksRouter);

app.listen(PORT, () => { console.log('Running XD') });
