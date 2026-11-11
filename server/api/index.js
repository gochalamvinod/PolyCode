import '../config/loadEnv.js';
import app from '../app.js';
import connectDB from '../config/db.js';

let ready;

export default async function handler(req, res) {
  ready ??= connectDB();
  await ready;
  return app(req, res);
}
