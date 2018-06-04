import fs from 'fs';
import path from 'path';
import svm from 'node-svm';
import TransactionDataset from './TransactionDataset';

const noOperation = () => {};

export default class Model {
    // Delegates
    onStateUpdated = noOperation;
    onProgressUpdated = noOperation;

    // Public
    trainingState = 'INITIAL';  // Possible states: INITIAL, LOADED, TRAINING, TRAINED
    trainingProgress = 0;
    trainedModel;
    trainingReport;

    // Private
    _dataset;
    _clf;

    // load csv file into an array of Transactions
    loadCSV(filename) {
        this._dataset = new TransactionDataset(filename);
        this._dataset.fixMissing();
        this.trainingState = 'LOADED';
        this.onStateUpdated();
    }

    loadModel(model) {
        this._trainedModel = require(path.resolve('./', model));
        this._clf = svm.restore(this._trainedModel);
        this.trainingState = 'TRAINED';
        this.onStateUpdated();
    }

    train(yField, options = {}) {
        const trainData = this._dataset.toTrainingData(yField);
        this._clf = new svm.CSVC(options);

        this.trainingState = 'TRAINING';
        this.onStateUpdated();

        this._clf.train(trainData)
            .progress(rate => {
                this.trainingProgress = rate;
                this.onProgressUpdated();
            })
            .spread((trainedModel, trainingReport) => {
                this.trainedModel = trainedModel;
                this.trainingReport = trainingReport;

                if (options.outputPath)
                    fs.writeFileSync(options.outputPath, JSON.stringify(trainedModel, null, '\t'));
            })
            .done(() => {
                this.trainingState = 'TRAINED';
                this.onStateUpdated();
            });;
    }

    predict(yField, options = {}) {
        const data = this._dataset.toTrainingData(yField);
        const result = data.map(tuple => {
            const prediction = this._clf.predictSync(tuple[0]);
            return prediction;
        });
        if (options.outputPath)
            fs.writeFileSync(options.outputPath, JSON.stringify(result, null, '\t'));
        return result;
    }
}