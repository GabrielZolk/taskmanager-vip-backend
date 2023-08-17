import express from "express";
import admin from 'firebase-admin';
import cors from 'cors'; // Importe o pacote cors
import { tasksRouter } from "./routes/indexRouter";

const app = express();

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());
app.use(cors());

app.use('/', tasksRouter);

app.listen(3000, () => { console.log('Running XD') });
