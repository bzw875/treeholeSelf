import { useEffect, useCallback, useState } from "react";
import "../App.css";
import { backendAPI } from "../backendAPI";
import { SortEnum, FieldEnum, TreeHoleType, RangeNum } from "../interface";
import TreeHoleCell from "./TreeHoleCell";
import NavigatorBar from "./NavigatorBar";
import FilterBar from "./FilterBar";
import { debounce } from "../utils";

export const DEFAULT_QUERY = {
  page: 0,
  size: 20,
  field: FieldEnum.DATE,
  sort: SortEnum.DESC,
  likeRange: RangeNum.NoLimit
};

function App() {
  const queryObj: any = new URLSearchParams(location.hash.slice(1));
  const newPage = Number(queryObj.get('page') || DEFAULT_QUERY.page);
  const newSize = Number(queryObj.get('size') || DEFAULT_QUERY.size);
  const newField = queryObj.get('field') || DEFAULT_QUERY.field;
  const newSort = queryObj.get('sort') || DEFAULT_QUERY.sort;
  const newLikeRange = queryObj.get('likeRange') || DEFAULT_QUERY.likeRange;
      
  const [treeHoles, setTreeHoles] = useState<TreeHoleType[]>([]);
  const [page, setPage] = useState(newPage);
  const [size, setSize] = useState(newSize);
  const [total, setTotal] = useState(0);
  const [field, setField] = useState(newField);
  const [sort, setSort] = useState(newSort);
  const [likeRange, setLikeRange] = useState(newLikeRange);
  const [isBottom, setIsBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = useCallback(debounce(async (page, size, field, sort, likeRange) => {
    setIsLoading(true);
    setTreeHoles([]);
    setTotal(0);
    try {
      const rps = await backendAPI.fetchAllTreeHole({
        page,
        size,
        field,
        sort,
        likeRange,
      });
      const data: any = rps.data;
      if (data.content) {
        setTreeHoles(data.content || []);
        setTotal(data.totalElements);
      } else {
        setTreeHoles(data || []);
        setTotal(data.length);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setIsLoading(false);
  }, 1000), []);
  
  const save2Url = () => {
    const params = {
      page,
      size,
      sort,
      field,
      likeRange
    }
    const urlStr = '#?' + new URLSearchParams(params as any);
    location.hash = urlStr;
    localStorage.setItem('pageVisit', urlStr)
  }

  useEffect(() => {
    handleQuery(page, size, field, sort, likeRange);
    save2Url();
  }, [page, size, field, sort, likeRange]);


  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollEle = document.documentElement;
      setIsBottom((window.innerHeight + scrollEle.scrollTop) > scrollEle.offsetHeight - 200);
    }, 100);

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setPage(page - 1);
      } else if (event.key === 'ArrowRight') {
        setPage(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyPress);

    // 清理事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.addEventListener('keydown', handleKeyPress);
    };
  }, []);


  return (
    <div className="relative">
      <h1 className="text-2xl">醇享版</h1>
      {isLoading ? <div className="loading-spinner mx-auto"></div> : <div>
        <div className={"flex mb-4 mt-4 page-nav" + (isBottom ? ' bottom-0' : '' )}>
          <div className="flex-1">
          <NavigatorBar
            page={page}
            size={size}
            total={total}
            sort={sort}
            field={field}
            onPageChange={(page) => setPage(page)}
            onSizeChange={(size) => setSize(size)}
            onFieldChange={(field) => { setField(field)}}
            onSortChange={(sort) => {setSort(sort)}}
          />
          </div>
          <FilterBar likeRange={likeRange} onLikeRangeChange={num => setLikeRange(num)} />
        </div>
        <div className="pb-20 pt-20">
          {treeHoles.map((tmp) => (
            <TreeHoleCell key={tmp.id} treeHole={tmp} />
          ))}
        </div>
      </div>}
    </div>
  );
}

export default App;
