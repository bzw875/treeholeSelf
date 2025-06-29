
import { useMemo } from 'react';
import { AishType } from '../interface';
import { CommentOutlined, EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { timeFromNow } from '../utils';
import { Link } from 'react-router-dom';

const aishurl = 'https://www.aish123.vip'

function AishCell(props: {data: AishType}) {
    const { author, title, articleUrl, articleId, area, isNewUserPost, replyCount, readCount, lastReplier, lastReplyTime } = props.data;
  return (
    <div className='text-base	text-slate-400 mb-6'>
        <Link target='_blank' className='text-slate-800 whitespace-pre-wrap' to={aishurl + articleUrl}>{title}</Link>
        <div className='flex mb-2 flex-wrap'>
            <Link target='_blank' className='text-slate-800' to={"/author/" + articleUrl}>{author}</Link>
            <a className='ml-4' href={"https://jandan.net/t/" + articleId} target='_blank'>{articleId}</a>
            <div className='flex flex-1 justify-end'>
              <div>{timeFromNow(lastReplyTime)}</div>
              <div className='ml-2'><MessageOutlined /> {lastReplier}</div>
              <div className='ml-2'><EyeOutlined />{readCount}</div>
              <div className='ml-2'><CommentOutlined /> {replyCount}</div>
              <div className='ml-2'>{area}</div>
            </div>
        </div>
    </div>
  );
}


export default AishCell
