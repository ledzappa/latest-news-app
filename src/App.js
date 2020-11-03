import "./App.css";
import { useState, useEffect } from "react";

const axios = require("axios");

const App = () => {
  const [news, setNews] = useState(null);
  const [filter, setFilter] = useState("all");
  const [filters, setFilters] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
  // const highlighted = ["trump", "corona"];

  useEffect(() => {
    const getNews = async () => {
      const result = await axios("/news");
      setNews(result.data);
      setFilters(
        result.data.reduce(
          (prev, cur) =>
            prev.indexOf(cur.source) === -1 ? [...prev, cur.source] : prev,
          ["all"]
        )
      );
    };

    // initial get
    getNews();

    // refresh every minute
    setInterval(() => getNews(), 60000);
  }, []);

  const hasKeyword = (title) => {
    return highlighted.some((v) => title.toLowerCase().includes(v)) || false;
  };

  const handleChange = (event) => {
    const val = event.target.value;
    setHighlighted(val.length !== 0 ? val.split(",") : []);
  };

  return (
    <div className="App">
      {filters.map((filter) => (
        <button class="btn btn-primary" onClick={() => setFilter(filter)}>
          {filter ? filter : "Alla"}
        </button>
      ))}
      <input
        className="form-control"
        type="text"
        value={highlighted.join(",")}
        onChange={(e) => handleChange(e)}
      />
      <table className="table table-striped text-left">
        <thead></thead>
        <tbody>
          {news
            ?.filter((item) => filter === "all" || item.source === filter)
            .map((item) => ({ ...item, pubDate: new Date(item.pubDate) }))
            .map((item) => ({
              ...item,
              formatedTime: `${item.pubDate.getHours()}:${item.pubDate.getMinutes()}`,
            }))
            .map((item) => (
              <tr
                className={
                  hasKeyword(item.title) ? "highlight" : "not-highlight"
                }
              >
                <td>{item.source}</td>
                <td>{item.formatedTime}</td>
                <td>
                  <h4>
                    <a target="_blank" href={item.link}>
                      {item.title}
                    </a>
                  </h4>
                  {/* <p dangerouslySetInnerHTML={{ __html: item.content }}></p> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
