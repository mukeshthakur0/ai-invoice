import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import {
  Search,
  PlayCircle,
  Globe,
  Loader2,
  AlertCircle,
  ExternalLink,
  Filter,
} from "lucide-react";
import "../styles/resources.css";

export default function Resources() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    videos: true,
    webpages: true,
    wikipedia: true,
  });
  const [searched, setSearched] = useState(false);

  const token = localStorage.getItem("token");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/resources/search`,
        {
          params: {
            q: query,
            include_videos: filters.videos,
            include_webpages: filters.webpages,
            include_wikipedia: filters.wikipedia,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(response.data);
      if (response.data.total === 0) {
        setError("No resources found for your search. Try a different query.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to search resources. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  return (
    <div className="resources-container">
      <Sidebar />

      <div className="resources-main">
        <div className="resources-header">
          <h1>Learning Resources</h1>
          <p>Search for videos, articles, and educational materials on any topic</p>
        </div>

        {/* Search Section */}
        <div className="resources-search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search for a topic, concept, or subject..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                {loading ? <Loader2 size={20} className="spinner" /> : "Search"}
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-header">
              <Filter size={18} />
              <span>Filter Results</span>
            </div>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.videos}
                  onChange={() => toggleFilter("videos")}
                />
                <span>Videos</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.webpages}
                  onChange={() => toggleFilter("webpages")}
                />
                <span>Webpages</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.wikipedia}
                  onChange={() => toggleFilter("wikipedia")}
                />
                <span>Wikipedia</span>
              </label>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Results Section */}
        {loading && (
          <div className="loading-state">
            <Loader2 size={40} className="spinner" />
            <p>Searching for resources...</p>
          </div>
        )}

        {results && !loading && (
          <div className="results-section">
            <div className="results-summary">
              Found <strong>{results.total}</strong> results for "
              <strong>{results.query}</strong>"
            </div>

            {/* Videos Section */}
            {results.videos && results.videos.length > 0 && (
              <div className="results-category">
                <div className="category-header">
                  <PlayCircle size={24} className="category-icon video-icon" />
                  <h2>Videos ({results.videos.length})</h2>
                </div>
                <div className="resources-grid">
                  {results.videos.map((video, index) => (
                    <div key={index} className="resource-card video-card">
                      <div className="card-thumbnail">
                        <img src={video.thumbnail} alt={video.title} />
                        <div className="play-overlay">
                          <PlayCircle size={48} />
                        </div>
                      </div>
                      <div className="card-content">
                        <h3>{video.title}</h3>
                        <p className="card-channel">{video.channel}</p>
                        <p className="card-source">{video.source}</p>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-link"
                        >
                          Watch Now <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Webpages Section */}
            {results.webpages && results.webpages.length > 0 && (
              <div className="results-category">
                <div className="category-header">
                  <Globe size={24} className="category-icon webpage-icon" />
                  <h2>Articles & Resources ({results.webpages.length})</h2>
                </div>
                <div className="webpages-list">
                  {results.webpages.map((webpage, index) => (
                    <div key={index} className="resource-card webpage-card">
                      <div className="card-header">
                        <h3>{webpage.title}</h3>
                        <span className="source-badge">{webpage.source}</span>
                      </div>
                      <p className="card-snippet">{webpage.snippet}</p>
                      <a
                        href={webpage.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-link"
                      >
                        Read More <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !results && searched === false && (
          <div className="empty-state">
            <div className="empty-icon">
              <Globe size={64} />
            </div>
            <h2>Start Exploring</h2>
            <p>Search for any topic to find videos, articles, and educational resources</p>
            <div className="example-searches">
              <p>Try searching for:</p>
              <div className="example-tags">
                <button onClick={() => setQuery("Machine Learning")}>
                  Machine Learning
                </button>
                <button onClick={() => setQuery("Python Programming")}>
                  Python Programming
                </button>
                <button onClick={() => setQuery("Biology Concepts")}>
                  Biology Concepts
                </button>
                <button onClick={() => setQuery("History Timeline")}>
                  History Timeline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
