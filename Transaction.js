import ChineseNumber from 'chinese-numbers-converter';

const NUMERIC_FIELDS = ['土地移轉總面積(平方公尺)', '交易年月日', '建物移轉總面積(平方公尺)', '建物現況格局-房', '建物現況格局-廳', '建物現況格局-衛', '總價(元)', '單價(元/平方公尺)', '車位移轉總面積(平方公尺)', '車位總價(元)'];
const BINARY_FIELDS = ['建物現況格局-隔間', '有無管理組織'];
const ENUM_FIELDS = ['鄉鎮市區'];

export default class Transaction {
    static EnumMap = new Map();

    constructor(object) {
        for (let field of NUMERIC_FIELDS) {
            this[field] = parseInt(object[field]);
            if (isNaN(this[field]))
                throw new Error();
        }
        for (let field of BINARY_FIELDS)
            this[field] = object[field] === '有' ? 1 : 0;

        for (let field of ENUM_FIELDS) {
            if (!Transaction.EnumMap.has(object[field]))
                Transaction.EnumMap.set(object[field], Transaction.EnumMap.size);
            this[field] = Transaction.EnumMap.get(object[field]);
        }
    }
}