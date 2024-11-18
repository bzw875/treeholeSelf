export interface TreeHoleType {
    id: number;
    author: string;
    context: string;
    dataId: string;
    likeNum: number;
    dislikeNum: number;
    commentNum: number;
    postDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export enum SortEnum {
    ASC = 'ASC',
    DESC = 'DESC'
}

export enum FieldEnum {
    LIKE = 'likeNum',
    DISLIKE = 'dislikeNum',
    COMMENT = 'commentNum',
    DATE = 'postDate',
}
export enum RangeNum {
    NoLimit = '0-∞',
    TwentyFive = '0-25',
    Fifty = '26-50',
    OneHundred = '51-100',
    TwoHundred = '101-200',
    FourHundred = '201-400',
    Infinity = '401-∞',
}
