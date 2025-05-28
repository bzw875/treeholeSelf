import { TreeHoleType } from '../interface';
import { timeFromNow } from '../utils';
import { Link } from 'react-router-dom';

function TreeHoleCell(props: {treeHole: TreeHoleType}) {
    const { author, content, post_id, vote_negative, vote_positive, sub_comment_count, date_gmt, ip_location } = props.treeHole;
  return (
    <div className='text-base	text-slate-400 mb-12'>
        <div className='flex mb-2 flex-wrap'>
            <Link target='_blank' className='text-slate-800' to={"/author/" + author}>{author}</Link>
            <a className='ml-4' href={"https://jandan.net/t/" + post_id} target='_blank'>{post_id}</a>
            <div className='flex flex-1 justify-end'>
              <div>{timeFromNow(date_gmt)}</div>
              <div className='ml-2'>IP: {ip_location}</div>
              <div className='ml-2'>OO: {vote_positive}</div>
              <div className='ml-2'>XX: {vote_negative}</div>
              <div className='ml-2'>评论: {sub_comment_count}</div>
            </div>
        </div>
        <div className='text-slate-800'>{content}</div>
    </div>
  );
}

export default TreeHoleCell
