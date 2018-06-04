import DatasetIterator from './DatasetIterator';

export default class Dataset {

    _dataEntries = [];
    _fields = [];
    _aggregators = {};

    constructor(dataEntries, fields = [], aggregators = {}, missingFixers= {}) {
        this._dataEntries = dataEntries;
        this._fields = fields;
        this._aggregators = aggregators;
        this._missingFixers = missingFixers;
    }

    _aggregate() {
        const aggregation = {};
        const aggregators = this._aggregators;
        for (let field in aggregators) {
            aggregation[field] = {}
        };

        this._dataEntries.forEach((dataEntry, index, array) => {
            for (let field in aggregators) {
                aggregation[field] = aggregators[field](aggregation[field], dataEntry[field], index, array);
            }
        });

        return aggregation;
    }

    fixMissing() {
        const aggregation = this._aggregate();
        this._dataEntries.forEach((dataEntry, index, array) => {
            for (let field of this._fields) {
                if (dataEntry[field] !== null)
                    continue;

                if (this._missingFixers[field]) {
                    // Fix with specific fixer
                    dataEntry[field] = this._missingFixers[field](aggregation[field]);
                } else {
                    // Drop data
                    array.splice(index, 1);
                    console.error('Dropped data at %d, missing %s field.', index, field);
                }
            }
        });
    }

    toTrainingData(yField) {
        return this._dataEntries.map(entry => entry.toTrainingData(yField));
    }

    [Symbol.iterator] = () => {
        return new DatasetIterator(this._dataEntries);
    }
}