import app from "./app.js";
import "./src/db/db.js";
import { PORT } from "./config.js";
import "./src/libs/setup.js";

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server on port ` + app.get('port'));
  });
};

start();
