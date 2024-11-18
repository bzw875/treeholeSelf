import './App.css'

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Author from './component/Author';
import Home from './component/Home';
import Search from './component/Search';


function App() {

  return (

  <Router>
      <div className="container w-[900px] mx-auto p-4">
        <nav className='mb-4 bg-gray-100 p-4 rounded-lg'>
          <ul className='flex flex-row items-center'>
            <li className='mr-4'><Link to="/">Home</Link></li>
            <li className='mr-4'><Link to="/author">Author</Link></li>
            <li className='mr-4'><Link to="/Search">Search</Link></li>
            <li className='mr-4'><a target='_blank' href="http://127.0.0.1:8080/treeHole?page=1&size=10&field=ASC&sort=postDate">分页排序</a></li>
            <li className='mr-4'><a target='_blank' href="http://127.0.0.1:8080/treeHole?page=1&size=10">分页</a></li>
            <li className='mr-4'><a target='_blank' href="http://127.0.0.1:8080/treeHole/search?q=同事">同事</a></li>
            <li className='mr-4'><a target='_blank' href="http://127.0.0.1:8080/treeHole/author/林芮">林芮</a></li>
            <li className='mr-4'><a target='_blank' href="http://127.0.0.1:8080/treeHole">全部</a></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/author/:author" element={<Author />} />
          <Route path="/search/" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
