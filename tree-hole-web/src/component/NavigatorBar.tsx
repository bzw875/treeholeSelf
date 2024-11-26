import { useMemo } from "react";
import { SortEnum, FieldEnum } from "../interface";

interface NavType {
  page: number;
  size: number;
  total: number;
  sort: SortEnum;
  field: FieldEnum;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onSortChange: (sort: SortEnum) => void;
  onFieldChange: (field: FieldEnum) => void;
}

const sizeList = [10, 25, 50, 100, 200, 400];

function NavigatorBar(props: NavType) {
  const {
    page,
    size,
    total,
    sort,
    field,
    onPageChange,
    onSizeChange,
    onSortChange,
    onFieldChange,
  } = props;
  const pages = Math.ceil(total / size);
  const pageList = useMemo(() => {
    const arr = [page];
    const offset = 10;
    for (let i = page + 1; i < Math.min(page + offset, pages); i++) {
      arr.push(i);
    }
    for (let j = page - 1; j > page - offset; j--) {
      if (j > 0) {
        arr.unshift(j);
      }
    }
    return arr;
  }, [total, size, page]);
  const handleSort = () => {
    onSortChange(sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC);
  };
  const fieldList = [FieldEnum.DATE, FieldEnum.LIKE, FieldEnum.DISLIKE, FieldEnum.COMMENT];
  const fieldNameList = ['日期', '喜欢', '不喜欢', '评论']

  
  return (
    <div className="flex items-center">
      <div className="text-slate-400">
        {page === 0 ? null : (
          <button className="mr-1" onClick={() => onPageChange(page - 1)}>
            Prev
          </button>
        )}
        {pageList.map((index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className="px-2 py-1 hover:bg-slate-400 hover:text-white rounded"
          >
            <span className={index === page ? "text-slate-800" : ""}>
              {index + 1}
            </span>
          </button>
        ))}
        {page === pages ? null : (
          <button onClick={() => onPageChange(page + 1)}>Next</button>
        )}
      </div>
      <div className="ml-8">
        <select onChange={(e: any) => onSizeChange(Number(e.target.value))}>
          {sizeList.map((tmp) => (
            <option key={tmp} value={tmp}>{tmp}</option>
          ))}
        </select>
      </div>
      <div className="ml-8 text-slate-400">
        <button onClick={handleSort} className="mr-1 text-slate-800">
          {sort === SortEnum.ASC ? "↑" : "↓"}
        </button>
        {fieldList.map((tmp, i) => <button key={tmp} className={field === tmp ? "text-slate-800 mr-2" : "mr-2"} onClick={() => onFieldChange(tmp)}>{fieldNameList[i]}</button>)}
      </div>
    </div>
  );
}

export default NavigatorBar;
