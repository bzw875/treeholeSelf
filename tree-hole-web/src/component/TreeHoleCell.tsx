import { TreeHoleType } from '../interface';
import { timeFromNow } from '../utils';
import { Link } from 'react-router-dom';

function TreeHoleCell(props: {treeHole: TreeHoleType}) {
    const { author, context, dataId, dislikeNum, likeNum, commentNum, postDate } = props.treeHole;
  return (
    <div className='text-base	text-slate-400 mb-12'>
        <div className='flex mb-2 flex-wrap'>
            <Link target='_blank' className='text-slate-800' to={"/author/" + author}>{author}</Link>
            <a className='ml-4' href={"https://jandan.net/t/" + dataId} target='_blank'>{dataId}</a>
            <div className='flex flex-1 justify-end'>
              <div>{timeFromNow(postDate)}</div>
              <div className='ml-2'>OO: {likeNum}</div>
              <div className='ml-2'>XX: {dislikeNum}</div>
              <div className='ml-2'>评论: {commentNum}</div>
            </div>
        </div>
        <div className='text-slate-800'>{context}</div>
    </div>
  );
}

export default TreeHoleCell
