const express = require("express");
const cors = require("cors");

const scrapedContentRoute = require("./routes/scraper-route");
const errorHandler = require("./middlewares/error-handler");

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/scraper", scrapedContentRoute);

app.use(errorHandler);

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on the port ${PORT}`);
});

const callBackUnhandled = (error, _promise) => {
  console.log(`Error ${error.message}`);
  server.close(() => {
    console.log("Server stoped!");
    process.exit(1);
  });
};

process.on("unhandledRejection", callBackUnhandled);
