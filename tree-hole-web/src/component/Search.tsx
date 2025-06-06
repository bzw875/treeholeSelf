import { useCallback, useState } from 'react'
import '../App.css'
import { backendAPI } from '../backendAPI';
import { TreeHoleType } from '../interface';
import TreeHoleCell from './TreeHoleCell';
import { debounce } from '../utils';


function Search() {
  const [treeHoles, setTreeHoles] = useState<TreeHoleType[]>([]);
  const [search, setSearch] = useState('');


  const handleSearch = useCallback(debounce((value) => {
    performSearch(value);
  }, 500), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    handleSearch(value);
  };

  const performSearch = async (value: string) => {
    if (!value) {
      return;
    }
    try {
      const rps = await backendAPI.searchTreeHole(value);
      const {code, data: {list}} = rps.data;
      if (code === 200) {
        setTreeHoles(list || []);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  return (
    <div className="container  mx-auto p-4">
      <h1>
        Search: <input type="search"
          className="pr-3 py-2 border border-gray-300 rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
         value={search} onChange={handleChange}  />
      </h1>
      {treeHoles.map(tmp => <TreeHoleCell treeHole={tmp} />)}
    </div>
  );
}

export default Search

