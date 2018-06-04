export default class DatasetIterator {
    _nextIndex = 0;
    _dataEntries;

    constructor(dataEntries) {
        this._dataEntries = dataEntries;
    }

    next() {
        if (this._nextIndex < this._dataEntries.length)
            return {
                value: this._dataEntries[this._nextIndex++],
                done: false
            };
        else
            return {
                done: true
            }
    }
}