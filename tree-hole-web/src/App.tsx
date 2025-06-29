import './App.css'

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Author from './component/Author';
import Home from './component/Home';
import Search from './component/Search';
import Tail from './component/Tail';
import Account from './component/Account';
import Statistics from './component/Statistics';
import Aish123 from './component/Aish123';
function App() {

  return (

  <Router>
      <div className="container  mx-auto p-4">
        <nav className='flex mb-4 p-4 rounded-lg'>
          <ul className='flex flex-row items-center flex-1'>
            <li className='mr-4'><Link to="/">Home</Link></li>
            <li className='mr-4'><Link to="/Search">Search</Link></li>
            <li className='mr-4'><Link to="/statistics">Statistics</Link></li>
            <li className='mr-4'><Link to="/aish123">Aish123</Link></li>
          </ul>
          <Account />
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/author/:author" element={<Author />} />
          <Route path="/search/" element={<Search />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/aish123" element={<Aish123 />} />
        </Routes>
      </div>
      <Tail />
    </Router>
  );
}

export default App
