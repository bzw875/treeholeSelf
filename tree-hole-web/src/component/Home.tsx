import { useEffect, useCallback, useState } from "react";
import "../App.css";
import { backendAPI } from "../backendAPI";
import { SortEnum, FieldEnum, TreeHoleType, RangeNum } from "../interface";
import TreeHoleCell from "./TreeHoleCell";
import NavigatorBar from "./NavigatorBar";
import FilterBar from "./FilterBar";
import { debounce } from "../utils";

export const DEFAULT_QUERY = {
  page: 1,
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

  const handleQuery = useCallback(debounce(async (page, size, field, sort, likeRange) => {
    try {
      const rps = await backendAPI.fetchAllTreeHole({
        page,
        size,
        field,
        sort,
        likeRange,
      });
      const data: any = await rps.json();
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
  }, 1000), []);
  
  const save2Url = () => {
    const params = {
      page,
      size,
      sort,
      field,
      likeRange
    }
    location.hash = '#?' + new URLSearchParams(params);
  }

  useEffect(() => {
    handleQuery(page, size, field, sort, likeRange);
    save2Url();
  }, [page, size, field, sort, likeRange]);


  return (
    <div>
      <h1>醇享版</h1>
      <FilterBar likeRange={likeRange} onLikeRangeChange={num => setLikeRange(num)} />
      {treeHoles.map((tmp) => (
        <TreeHoleCell key={tmp.id} treeHole={tmp} />
      ))}
      <div>
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
    </div>
  );
}

export default App;
