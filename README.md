# web-scraping-api
Web Scraping API Service

## Table of Contents
* [Description](#description)
* [Technologies](#technologies)
* [Setup](#setup)
* [API](#api)

## Description
This is a Web Scraping API service that allows users to input a webpage URL and receive structured data scraped from that webpage.<br />

## Technologies
The primary technologies used to develop Zapentest were:
* Client:
  * Next.js
* Server:
  * Node.js,
  * Express.js
  * Puppeteer

## Setup
1. Please make sure you've downloaded the source code locally. <br />
2. Run the server: 
   * > cd web-scraping-api-service
   * > npm install
   * > npm run dev <br />
   * By default, this server runs on the port 5000.
3. Run the client:
   * > cd web-scraping-api-client
   * > npm install
   * > npm run dev <br />
   * Access the following link in your browser: http://localhost:3000/. By default, this client run on the port 3000.
   * In the main page you'll see an input and 2 checkboxes. Enter the URL you want to scraple. Using the checkboxes is optional, depending on your preferences.

## API
### Scrape URL
#### Request
```http
GET /scraper?url=https://wsa-test.vercel.app/
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `url` | `string` | **Required**. Your URL |
| `images` | `boolean` | **Optional**. Includes the image links from the scraped webpage |
| `sentiment` | `boolean` | **Optional**. Includes sentiment analysis |

#### Responses
This API endpoint returns a JSON, and based on the URL, you can get one of the following responses:
```javascript
{
  "title" : string,
  "description" : bool,
  "image" : string,
  "sentiment" : string
}
```
```javascript
[{
  "title" : string,
  "description" : bool,
  "image" : string,
  "sentiment" : string
}, {...}, {....}]
```