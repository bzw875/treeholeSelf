import { SortEnum, FieldEnum, RangeNum } from "./interface";

const hostName = 'http://127.0.0.1:8080';

interface queryType {
    page: number;
    size: number;
    sort: SortEnum;
    field: FieldEnum;
    likeRange: string;
}

export const backendAPI = {
    fetchAllTreeHole: (params: queryType) => {
        const p = {
            ...params,
            likeRange: params.likeRange === RangeNum.NoLimit ? '' : params.likeRange,
            page: String(params.page),
            size: String(params.size)
        };
        return fetch(hostName + '/treeHole?' + new URLSearchParams(p));
    },

    findByAuthor: (author: string) => {
        return fetch(hostName + '/treeHole/author/' + author);
    },
    
    searchTreeHole: (keyword: string) => {
        return fetch(hostName + '/treeHole/search?q=' + keyword)
    }
}