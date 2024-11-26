import './App.css'

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Author from './component/Author';
import Home from './component/Home';
import Search from './component/Search';
import Tail from './component/Tail';
import Account from './component/Account';

function App() {

  return (

  <Router>
      <div className="container w-[900px] mx-auto p-4">
        <nav className='flex mb-4 bg-gray-100 p-4 rounded-lg'>
          <ul className='flex flex-row items-center flex-1'>
            <li className='mr-4'><Link to="/">Home</Link></li>
            <li className='mr-4'><Link to="/author/满街乱逛者">Author</Link></li>
            <li className='mr-4'><Link to="/Search">Search</Link></li>
          </ul>
          <Account />
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/author/:author" element={<Author />} />
          <Route path="/search/" element={<Search />} />
        </Routes>
      </div>
      <Tail />
    </Router>
  );
}

export default App
