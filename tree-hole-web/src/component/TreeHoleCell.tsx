import { TreeHoleType } from '../interface';
import { timeFromNow } from '../utils';
import { Link } from 'react-router-dom';

function TreeHoleCell(props: {treeHole: TreeHoleType}) {
    const { id, author, context, dataId, dislikeNum, likeNum, commentNum, postDate } = props.treeHole;
  return (
    <div className='text-sm	text-slate-400'>
        <div className='flex mb-2'>
            <Link target='_blank' to={"/author/" + author}>{author}</Link>
            <a className='ml-4' href={"https://jandan.net/t/" + dataId} target='_blank'>{dataId}</a>
            <div className='flex flex-1 justify-end'>
              <div>{timeFromNow(postDate)}</div>
              <div className='ml-2'>OO: {likeNum}</div>
              <div className='ml-2'>XX: {dislikeNum}</div>
              <div className='ml-2'>评论: {commentNum}</div>
            </div>
        </div>
        <div className='text-slate-800'>{context}</div>
        <hr className='mt-6 mb-6'/>
    </div>
  );
}

export default TreeHoleCell
