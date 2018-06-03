import DatasetIterator from './DatasetIterator';

export default class Dataset {

    _dataEntries = [];

    constructor(set) {
        this._dataEntries = set;
    }

    [Symbol.iterator] = () => {
        return new DatasetIterator(this._dataEntries);
    }
}