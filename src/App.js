import React, {useEffect, useState} from 'react';
import { useDebounce } from './utilities';
import axios from 'axios';
import './scss/App.scss';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {
  const [menuOpen, setMenuOpen ] = useState(false);

  // console.log(url, axios);

  const sidebarStyles = menuOpen ? 'sidebar sidebar--open' : 'sidebar'
  const overlayStyles = menuOpen ? 'overlay overlay--open' : 'overlay'

  return (
    <BrowserRouter>
      <div className="App">
        <section className="header">
          <h1 className="header__heading">Movie Database</h1>
          <aside className={sidebarStyles}>
            <ul className="sidebar__list">
              <li className="sidebar__item"><a className="sidebar__link" href="">Home</a></li>
              <li className="sidebar__item"><a className="sidebar__link" href="">Link1</a></li>
              <li className="sidebar__item"><a className="sidebar__link" href="">Link2</a></li>
            </ul>
          </aside>
          <div className={overlayStyles} onClick={() => setMenuOpen(!menuOpen)}></div>
          
        </section>
        <Routes>
          <Route path="/" element={<SearchApp />} />
          <Route path="/link-1" element={<Link1Page />} />
          <Route path="/link-2" element={<Link2Page />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const Link1Page = () => {
  <div>Link 1 Page</div>
}

const Link2Page = () => {
  <div>Link 2 Page</div>
}

const SearchApp = () => {

  const apiStuff = {
    key: process.env.REACT_APP_API_KEY,
    base: 'https://api.themoviedb.org/3/',
    search: 'search/movie',
    params: '&language=en-US&page=1&include_adult=false'
  }

  const [searchTerm, setSearchTerm ] = useState('')
  const [results, setResults] = useState([])

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const apiKey = apiStuff.key;
  const baseURL = apiStuff.base;
  const searchPath = apiStuff.search;
  const extraParams = apiStuff.params;

  const url = `${baseURL}${searchPath}?api_key=${apiKey}${extraParams}`;

  const getMovie = async (url, query) => {
    try {
      const response = await axios.get(`${url}&query=${query}`)
      console.log(response)
      setResults(response.data.results)
    } catch (err) {
      console.log(err.message, err.code)
    }
  }

  const sortMovies = (res, order) => {
    let resultsCopy = [...res]

    switch(order){
      case 'asc':
        resultsCopy = resultsCopy.sort((a,b) => a.vote_average - b.vote_average)
        setResults(resultsCopy)
        break;
      default:
        resultsCopy = resultsCopy.sort((a,b) => b.vote_average - a.vote_average)
        setResults(resultsCopy)
    }
  }

  useEffect(() => {
    if(debouncedSearchTerm){
      getMovie(url, debouncedSearchTerm)
    } else{
      setResults([])
    }
  }, [debouncedSearchTerm, url])



  return (
    <main className="search-block">
      <section className="search">
        {/* <button className="results__sort-button results__sort-button_asc" onClick={() => sortMovies(results, 'asc')}>Sort ASC</button>
        <button className="results__sort-button results__sort-button_desc" onClick={() => sortMovies(results, 'desc')}>Sort DESC</button> */}
        <input className="search__input" type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
      </section>
      <ul className="results">
        {results.map((result) => (
          <li className="results__item" key={result.id}>
            <p className="results__rating">Rating<span className="results__score">{result.vote_average}</span></p>
            {result.poster_path ? <img className="results__image" loading="lazy" src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`} alt={result.title} /> : <div className="results__placeholder"></div>}
            <p className="results__title">{result.title}<span className="results__count">{result.vote_count} votes</span> </p>
            {/* <p className="results__year">{result.release_date.slice(0,4)}</p> */}
          </li>
        )
        )}
      </ul>
    </main>
  )
}

export default App;