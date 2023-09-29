const puppeteer = require("puppeteer");

const { validateURL } = require("../utils/validators");
const { scrapeMainPage, scrapeDetailsPage } = require("../services/scraper");

exports.getScrapedContent = async (req, res, next) => {
  const { url, images, sentiment } = req.query;
  console.log(url);
  const includeImages = images === "true";
  const analyzeSentiment = sentiment === "true";
  if (!url || !validateURL(url)) {
    return next({
      errorMessage: "Invalid URL",
      statusCode: 400,
    });
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  const mainContent = await page.$$eval("main", (nodes) =>
    nodes.map((node) => node.innerHTML)
  );

  if (mainContent.length > 0) {
    const results = await scrapeMainPage(page, includeImages, analyzeSentiment);
    res.status(200).json(results);
  } else {
    const results = await scrapeDetailsPage(
      page,
      includeImages,
      analyzeSentiment
    );
    res.status(200).json(results);
  }
};
