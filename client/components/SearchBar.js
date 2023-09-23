import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/SearchBar.module.css';
import axios from 'axios';

function Search({ allTweets, setAllTweets, allVideos, setAllVideos, allStories, setAllStories }) {
  const [query, setQuery] = useState("")
  const [showHashtag, setShowHashtag] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const containerRef = useRef(null);

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      search(query);
    }
  }

  const handleIconClick = () => {
    setShowHashtag(!showHashtag);
    setShowSubmenu(false);
  };

  const handleHashtagClick = () => {
    setShowSubmenu(!showSubmenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowHashtag(false);
        setShowSubmenu(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    const searchParams = new URLSearchParams(window.location.search);
    const queryParam = searchParams.get('query');
    if (queryParam) {
      search(queryParam);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);


  function search(queryParam) {
    const searchQuery = queryParam || query;
    const currentPath = window.location.pathname;
    console.log("hh", searchQuery)
    let searchEndpoint;
    let setAllItems;
    let itemsKey;
    if (currentPath === '/explore') {
      searchEndpoint = `${process.env.BASE_URL}/video/search`;
      itemsKey = 'videos';
      setAllItems = setAllVideos;
      console.log("video")
    } else if (currentPath === '/tweets') {
      searchEndpoint = `${process.env.BASE_URL}/tweet/search`;
      itemsKey = 'tweets';
      setAllItems = setAllTweets;
      console.log("tweets")
    } else if (currentPath === '/stories') {
      searchEndpoint = `${process.env.BASE_URL}/story/search`;
      itemsKey = 'stories';
      setAllItems = setAllStories;
      console.log("stories")
    } else {
      console.log("no")
      return;
    }

    axios.get(searchEndpoint, {
      params: {
        query: searchQuery,
      },
    })
      .then((response) => {
        const items = response.data[itemsKey];
        console.log("O", items)
        setAllItems(items);
        console.log('Items found:', items);
        setQuery("");

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('query', searchQuery);
        const newURL = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState(null, null, newURL);
      })
      .catch((error) => {
        console.error('Error searching items:', error);
      });
  }

  return (
    <div className={styles.searchForm} ref={containerRef}>
      <form
        className={`d-flex search d-flex align-items-center border-primary px-3 ${styles.search}`}
        role="search"
        id="searchForm"
      >
        <i
          className={`bi bi-search ${styles.searchIcon}`} onClick={() => search()}
        ></i>
        <input
          id="search"
          type="search"
          placeholder="Search"
          className={`bg-transparent border-0 ps-2 ${styles.search_input}`}
          onClick={handleIconClick}
          onKeyDown={handleKeyPress}
          value={query} onChange={e => setQuery(e.target.value)}
        />
      </form>
      {showHashtag && (
        <div
          className={`${styles.link_categories} ${showSubmenu ? styles.show : ''}`}
        >
          <div className={styles.link} onClick={handleHashtagClick}>
            <h3 className={styles.categories} >#</h3>
          </div>
          <div className={styles.submenu}>
            <a className={styles.submenuItem} onClick={() => search('beat')}>
              #beat
            </a>
            <a className={styles.submenuItem} onClick={() => search('instrumental')}>
              #instrumental
            </a>
            <a className={styles.submenuItem} onClick={() => search('music')}>
              #music
            </a>
            <a className={styles.submenuItem} onClick={() => search('tutorial')}>
              #tutorial
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;





