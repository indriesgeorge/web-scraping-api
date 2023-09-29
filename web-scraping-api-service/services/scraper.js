const puppeteer = require("puppeteer");

exports.scrapeMainPage = async (page, includeImages, analyzeSentiment) => {
  let texts = await page.$$eval("div", (divs) => {
    return divs.map((elem) => {
      return elem.textContent.trim().length > 0 ? elem.innerText : null;
    });
  });
  texts = texts.filter((text) => !!text && !text.includes("\n"));
  const textsSet = new Set(texts);
  texts = Array.from(textsSet);
  texts = texts.slice(2);
  let results = [];
  for (let idx = 0; idx < texts.length; idx += 5) {
    const titlePos = idx + 1;
    const descriptionPos = idx + 2;
    const title = titlePos < texts.length ? texts[idx + 1] : null;
    const description = descriptionPos < texts.length ? texts[idx + 2] : null;
    let result = {
      title,
      description,
    };
    if (analyzeSentiment) {
      const sentiment = detectSentiment(title, description);
      result = {
        ...result,
        sentiment,
      };
    }
    results.push(result);
  }
  if (includeImages) {
    let images = await page.$$eval("a", (elements) =>
      elements.map((elem) => {
        const image = elem.querySelector("img");
        return image ? { src: image.src } : null;
      })
    );
    images = images.filter((image) => image);
    results = results.map((el, idx) => ({ ...el, image: images[idx].src }));
  }

  return results;
};

exports.scrapeDetailsPage = async (page, includeImages, analyzeSentiment) => {
  let results = await page.$$eval("div", (divs) => {
    let divTexts = divs.map((div) => div.innerText.trim());
    const parts = divTexts.join("").split("\n");
    const title = parts[1];
    const description = parts.slice(2).join("\n");

    return {
      title,
      description,
    };
  });

  if (includeImages) {
    let images = await page.$$eval("div", (elements) =>
      elements.map((elem) => {
        const image = elem.querySelector("img");
        return image ? { src: image.src } : null;
      })
    );
    images = images.filter((image) => image);
    const blogImage = images[0];
    results = {
      ...results,
      image: blogImage.src,
    };
  }

  if (analyzeSentiment) {
    const sentiment = detectSentiment(results.title, results.description);
    results = {
      ...results,
      sentiment,
    };
  }

  return results;
};

const detectSentiment = (title, description) => {
  const content = title + " " + description;
  const positiveWords = [
    "joy",
    "blissful",
    "positive",
    "happiness",
    "benefits",
    "delightful",
  ];
  const neutralWords = [
    "neutral",
    "balanced",
    "open",
    "candid",
    "unbiased",
    "strategies",
    "challenges",
  ];
  const negativeWords = [
    "disappointing",
    "negative",
    "disaster",
    "not-so-rosy",
    "downsides",
  ];

  const sentimentsScore = {
    positivity: 0,
    negativity: 0,
    neutrality: 0,
  };

  positiveWords.forEach((word) => {
    if (content.includes(word)) {
      sentimentsScore.positivity += 1;
    }
  });

  neutralWords.forEach((word) => {
    if (content.includes(word)) {
      sentimentsScore.neutrality += 1;
    }
  });

  negativeWords.forEach((word) => {
    if (content.includes(word)) {
      sentimentsScore.negativity += 1;
    }
  });

  const max = Object.entries(sentimentsScore).reduce(
    (max, [sentiment, score]) => {
      return score > max.score ? { sentiment, score } : max;
    },
    { sentiment: "", score: 0 }
  );
  return max.sentiment;
};
