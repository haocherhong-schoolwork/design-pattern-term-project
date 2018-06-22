export default class Controller {
    _view;
    _model;

    constructor(view, model) {
        this._model = model;
        this._view = view;

        this._model.onProgressUpdated = this.handleProgressUpdated;
        this._model.onStateUpdated = this.handleStateUpdated;

        this._view.onReadTrain = this.handleReadTrain;
        this._view.onReadPredict = this.handleReadPredict;
    }

    handleProgressUpdated = () => {
        this._view.writeProgress(this._model.trainingProgress);
    }

    handleStateUpdated = () => {
        this._view.writeState(this._model.trainingState);
        if (this._model.trainingState === 'TRAINED' && this._model.trainingReport)
            this._view.write(this._model.trainingReport);
    }

    handleReadTrain = (inputFile, yField, options = {}) => {
        this._model.loadCSV(inputFile);
        this._model.train(yField, options);
    }

    handleReadPredict = (inputFile, yField, model, options = {}) => {
        this._model.loadCSV(inputFile);
        this._model.loadModel(model);
        const predictions = this._model.predict(yField, options);

        if (!options.outputPath)
            this._view.write(predictions);
    }
}