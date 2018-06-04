import DatasetIterator from './DatasetIterator';

export default class Dataset {

    _dataEntries = [];

    constructor(set) {
        this._dataEntries = set;
    }

    toTrainingData(yField) {
        return this._dataEntries.map(entry => entry.toTrainingData(yField));
    }

    [Symbol.iterator] = () => {
        return new DatasetIterator(this._dataEntries);
    }
}