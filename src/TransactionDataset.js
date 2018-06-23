import fs from 'fs';

import TransactionDataEntry, {NUMERIC_FIELDS, BINARY_FIELDS, ENUM_FIELDS} from './TransactionDataEntry';
import DataSet from './DataSet';
import combineAggregators from './aggregators/combineAggregators';
import MeanAggregator from './aggregators/MeanAggregator';
import MeanMissingFixer from './missingFixers/MeanMissingFixer';

export default class TransactionDataSet extends DataSet {
    static loadCSV = filename => {
        const input = fs.readFileSync(filename, 'utf8'); // load file into string
        const rows = input.split('\r\n'); // split string into rows
        const headers = rows[0].split(','); // row 0 is header
        const output = [];
        for (let i = 2; i < rows.length; i++) { // iterate from row 2 to the end
            const row = rows[i];
            const columns = row.split(','); // split row into columns
            const object = {};
            // Map columns to plain object
            for (let j = 0; j < columns.length; j++)
                object[headers[j]] = columns[j];
            const transaction = new TransactionDataEntry(object);
            output.push(transaction);
        }
        return output;
    }

    constructor(filename) {
        const dataEntries = TransactionDataSet.loadCSV(filename);
        const fields = [
            ...NUMERIC_FIELDS,
            ...BINARY_FIELDS,
            ...ENUM_FIELDS
        ];
        const aggregators = {};
        const missingFixers = {};

        for (let field of NUMERIC_FIELDS) {
            aggregators[field] = combineAggregators({
                'mean': new MeanAggregator()
            });
            missingFixers[field] = new MeanMissingFixer()
        }

        super(dataEntries, fields, aggregators, missingFixers);
    }
}