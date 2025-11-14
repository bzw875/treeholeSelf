import { useEffect, useState } from "react";
import { backendAPI } from "../backendAPI";

function Statistics() {
    const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = () => {
    backendAPI.fetchStatistics().then(res => {
      const {code, data} = res.data;
      if (code === 200) {
        setData(data.list);
      }
    });
  }

  return (
    <div>
<table className="table-auto w-full">
  <thead>
    <tr>
      <th>作者</th>
      <th>文章</th>
      <th>点赞</th>
      <th>不喜欢</th>
      <th>评论</th>
    </tr>
  </thead>
  <tbody>
    {data.map((item) => (
      <tr key={item.id}>
        <td><a className="text-blue-500" href={`/author/${item.author}`}>{item.author}</a></td>
        <td>{item.articles_posted}</td>
        <td>{item.total_likes}</td>
        <td>{item.total_dislikes}</td>
        <td>{item.comments_received}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default Statistics;