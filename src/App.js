import "./App.css";
import { useState, useEffect } from "react";

const axios = require("axios");

const App = () => {
  const [news, setNews] = useState(null);
  const [filter, setFilter] = useState("alla");
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      const result = await axios("/news");
      setNews(result.data);
      setFilters(
        result.data.reduce(
          (prev, cur) =>
            prev.indexOf(cur.source) === -1 ? [...prev, cur.source] : prev,
          ["alla"]
        )
      );
    };

    getNews();
  }, []);

  return (
    <div className="App">
      {filters.map((filter) => (
        <button class="btn btn-primary" onClick={() => setFilter(filter)}>
          {filter}
        </button>
      ))}
      <table class="table table-striped text-left">
        <thead></thead>
        <tbody>
          {news
            ?.filter((item) => filter === "alla" || item.source === filter)
            .map((item) => ({ ...item, pubDate: new Date(item.pubDate) }))
            .map((item) => ({
              ...item,
              formatedTime: `${item.pubDate.getHours()}:${item.pubDate.getMinutes()}`,
            }))
            .map((item) => (
              <tr>
                <td>{item.source}</td>
                <td>{item.formatedTime}</td>
                <td>
                  <h4>{item.title}</h4>
                  <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
