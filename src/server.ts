import db from "./db/index.js";
import app from "./app.js";
import env from "./config/env.js";

app.listen(env.PORT, () => {
    console.log(`app listening on port ${env.PORT}`);
});

const result = await db.execute("select current_database()");
// console.log(result);