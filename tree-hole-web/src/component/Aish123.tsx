import { useEffect, useCallback, useState, useMemo } from "react";
import "../App.css";
import { backendAPI } from "../backendAPI";
import { SortEnum, FieldEnum, TreeHoleType, RangeNum } from "../interface";
import AishCell from "./AishCell";
import { debounce } from "../utils";

export const DEFAULT_QUERY = {
  page: 0,
  size: 20,
  field: FieldEnum.DATE,
  sort: SortEnum.DESC,
  likeRange: RangeNum.NoLimit
};

export type Aish123Type = TreeHoleType & {
  title: string;
};

const areas = ['全部', '浦东新区', '徐汇区', '长宁区', '普陀区', '虹口区', '杨浦区', '黄浦区', '静安区', '宝山区', '闵行区', '嘉定区', '松江区', '金山区', '青浦区', '奉贤区', '崇明区']

function Aish123() {     
  const [aishPost, setAishPost] = useState<Aish123Type[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [area, setCheckedArea] = useState<string>('');

  const handleQuery = useCallback(debounce(async () => {
    setIsLoading(true);
    setAishPost([]);
    try {
      const rps = await backendAPI.fetchAish123();
      const {code, data: {list, total}} = rps.data;
      if (code === 200) {
        setAishPost(list || []);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setIsLoading(false);
  }, 1000), []);
  

  useEffect(() => {
    handleQuery();
  }, []);

  const filterPost = useMemo(() => {
    const result1 = (area && area !== '全部') ? aishPost.filter((item) => item.area === area) : aishPost;
    if (searchText) {
      return result1.filter((item) => item.title.includes(searchText) || item.author.includes(searchText));
    }
    return result1;
  }, [searchText, aishPost, area]);

  return (
    <div className="relative">
      <h1 className="text-2xl">醇享版</h1>
      <div>
        过滤: <input type="text" value={searchText}
          className="border border-slate-300 rounded px-2 py-1"
         onChange={(e) => setSearchText(e.target.value)} />
         共 {filterPost.length}
      </div>
      <div>
        地区:
        {areas.map((area) => (
          <label key={area}>
              <input name="area" value={area} onChange={(e) => setCheckedArea(e.target.value)} type="radio" />
              {area}
          </label>
        ))}
      </div>
      {isLoading ? <div className="loading-spinner mx-auto"></div> : <div>
        <div className="tree-hole-list pt-20">
          {filterPost.map((tmp) => (
            <AishCell key={tmp.id} data={tmp} />
          ))}
        </div>
      </div>}
    </div>
  );
}

export default Aish123;
