import DataSetIterator from './DataSetIterator';
import DataEntry from './DataEntry';

export default class DataSet {

    _dataEntries = [];
    _fields = [];
    _aggregators = {};
    _missingFixers = {};

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
                aggregation[field] = aggregators[field].aggregate(aggregation[field], dataEntry[field], index, array);
            }
        });

        return aggregation;
    }

    fixMissing() {
        const aggregation = this._aggregate();
        return this.filter(dataEntry => {
            // If there is an empty field and no MissingFixer for it, drop it.
            for (let field of this._fields) {
                if (dataEntry[field] === null && !this._missingFixers[field])
                    return false;
            }
            return true;
        })
        .map(dataEntry => {
            const transformedDataEntry = new DataEntry();
            for (let field of this._fields) {
                if (dataEntry[field] === null)
                    transformedDataEntry[field] = this._missingFixers[field].fix(aggregation[field]);
                else
                    transformedDataEntry[field] = dataEntry[field];
            }
            return transformedDataEntry;
        });
    }

    filter(callback) {
        const newDataEntries = this._dataEntries.filter(callback);
        return new DataSet(newDataEntries, this._fields, this._aggregators, this._missingFixers);
    }

    map(callback) {
        const newDataEntries = this._dataEntries.map(callback);
        return new DataSet(newDataEntries, this._fields, this._aggregators, this._missingFixers);
    }

    limit(number) {
        const newDataEntries = this._dataEntries.slice(0, number);
        return new DataSet(newDataEntries, this._fields, this._aggregators, this._missingFixers);
    }

    shuffle() {
        const newDataEntries = this._dataEntries.slice(0);
        let counter = newDataEntries.length;

        // While there are elements in the array
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);

            counter--;

            let temp = newDataEntries[counter];
            newDataEntries[counter] = newDataEntries[index];
            newDataEntries[index] = temp;
        }

        return new DataSet(newDataEntries, this._fields, this._aggregators, this._missingFixers);
    }

    toTrainingData(yField) {
        return this._dataEntries.map(entry => entry.toTrainingData(yField));
    }

    [Symbol.iterator] = () => {
        return new DataSetIterator(this._dataEntries);
    }
}