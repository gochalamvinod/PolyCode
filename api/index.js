import '../server/config/loadEnv.js';
import app from '../server/app.js';
import connectDB from '../server/config/db.js';

let ready;

export default async function handler(req, res) {
  ready ??= connectDB();
  await ready;
  return app(req, res);
}
