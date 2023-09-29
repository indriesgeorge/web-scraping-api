'use client';

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [includeImages, setIncludeImages] = useState(false);
  const [includeSentiment, setIncludeSentiment] = useState(false);

  const fetchData = async () => {
    try {
      let queryString = `url=${url}`;
      if (includeImages) queryString += '&images=true';
      if (includeSentiment) queryString += '&sentiment=true';
      const response = await fetch(`http://localhost:5000/scraper?${queryString}`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>URL Scraper</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter the URL"
        style={{ width: '80%', marginRight: '10px' }}
      />
      <br />
      <label>
        <input
          type="checkbox"
          checked={includeImages}
          onChange={() => setIncludeImages(prev => !prev)}
        />
        Include Images
      </label>
      <label style={{ marginLeft: '10px' }}>
        <input
          type="checkbox"
          checked={includeSentiment}
          onChange={() => setIncludeSentiment(prev => !prev)}
        />
        Include Sentiment
      </label>
      <br />
      <button onClick={fetchData} style={{ marginTop: '10px' }}>Fetch Data</button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          {Array.isArray(data) ? (
            <ul>
              {data.map((item, index) => (
                <li key={index} style={{ marginBottom: '20px' }}>
                  <h2>Title: {item.title}</h2>
                  <p>Description: {item.description}</p>
                  {item.image && <img src={item.image} alt={item.title} style={{ maxWidth: '300px' }} />}
                  {item.sentiment ? <p><strong>Sentiment:</strong> {item.sentiment}</p> : ''}
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <h2>{data.title}</h2>
              <p>{data.description}</p>
              {data.image && <img src={data.image} alt={data.title} style={{ maxWidth: '300px' }} />}
              {data.sentiment ? <p><strong>Sentiment:</strong> {data.sentiment}</p> : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
