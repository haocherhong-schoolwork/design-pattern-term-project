import fs from 'fs';
import svm from 'node-svm';
import Dataset from './Dataset';
import Transaction from './Transaction';

const noOperation = () => {};

export default class Model {
    // Delegates
    onStateUpdated = noOperation;
    onProgressUpdated = noOperation;

    // Public
    trainingState = 'INITIAL';  // Possible states: INITIAL, LOADED, TRAINING, DONE
    trainingProgress = 0;
    trainedModel;
    trainingReport;

    // Private
    _transactions;
    _dataset;

    // load csv file into an array of Transactions
    loadCSV(filename) {
        const input = fs.readFileSync(filename, 'utf8'); // load file into string
        const rows = input.split('\r\n'); // split string into rows
        const headers = rows[0].split(','); // row 0 is header
        this._transactions = [];
        for (let i = 2; i < rows.length; i++) { // iterate from row 2 to the end
            const row = rows[i];
            const columns = row.split(','); // split row into columns
            const object = {};
            // Map columns to plain object
            for (let j = 0; j < columns.length; j++)
                object[headers[j]] = columns[j];
            try {
                // convert plain object to Transaction
                const transaction = new Transaction(object);
                this._transactions.push(transaction);
            } catch (e) {
                // console.error(e);
            }
        }
        this._dataset = new Dataset(this._transactions);

        this.trainingState = 'LOADED';
        this.onStateUpdated();
    }

    train(yField) {
        const trainData = this._dataset.toTrainingData(yField);
        const clf = new svm.CSVC();

        this.trainingState = 'TRAINING';
        this.onStateUpdated();

        clf.train(trainData.slice(0))
            .progress(rate => {
                this.trainingProgress = rate;
                this.onProgressUpdated();
            })
            .spread((trainedModel, trainingReport) => {
                this.trainedModel = trainedModel;
                this.trainingReport = trainingReport;
            })
            .done(() => {
                this.trainingState = 'DONE';
                this.onStateUpdated();
            });;
    }
}