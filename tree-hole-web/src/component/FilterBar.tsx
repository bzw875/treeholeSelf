import { RangeNum } from '../interface';

interface NavType {
    likeRange: RangeNum;
    onLikeRangeChange: (page: RangeNum) => void;
}


const nameList = [RangeNum.NoLimit, RangeNum.TwentyFive, RangeNum.Fifty, RangeNum.OneHundred, RangeNum.TwoHundred, RangeNum.FourHundred, RangeNum.Infinity];

function FilterBar(props: NavType) {
    const {likeRange , onLikeRangeChange } = props;
  return (
    <select value={likeRange} onChange={(e:any) => onLikeRangeChange(e.target.value)}>
        {nameList.map((tmp) => <option key={tmp} value={tmp}>{tmp}</option>)}
    </select>
  );
}

export default FilterBar
