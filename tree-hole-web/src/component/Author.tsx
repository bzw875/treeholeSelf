import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import '../App.css'
import { backendAPI } from '../backendAPI';
import { TreeHoleType } from '../interface';
import TreeHoleCell from './TreeHoleCell';

function Author() {
  const [treeHoles, setTreeHoles] = useState<TreeHoleType[]>([]);
  const { author } = useParams();

  const getData = async () => {
    try {
      const rps = await backendAPI.findByAuthor(author || '');
      const {code, data: {list}} = rps.data;
      if (code === 200) {
        setTreeHoles(list || []);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  

  if (!treeHoles.length) return <div>Loading...</div>;

  return (
    <div className="container  mx-auto p-4">
      <h1 className="text-2xl mb-8">{author}</h1>
      {treeHoles.map(tmp => <TreeHoleCell treeHole={tmp} />)}
    </div>
  );
}

export default Author

