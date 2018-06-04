export default class Controller {
    view;
    model;

    constructor(view, model) {
        this.model = model;
        this.view = view;

        this.model.onProgressUpdated = this.handleProgressUpdated;
        this.model.onStateUpdated = this.handleStateUpdated;

        this.view.onReadTrain = this.handleReadTrain;
        this.view.onReadPredict = this.handleReadPredict;
    }

    handleProgressUpdated = () => {
        this.view.writeProgress(this.model.trainingProgress);
    }

    handleStateUpdated = () => {
        this.view.writeState(this.model.trainingState);
        if (this.model.trainingState === 'TRAINED' && this.model.trainingReport)
            this.view.write(this.model.trainingReport);
    }

    handleReadTrain = (inputFile, yField, options = {}) => {
        this.model.loadCSV(inputFile);
        this.model.train(yField, options);
    }

    handleReadPredict = (inputFile, yField, model, options = {}) => {
        this.model.loadCSV(inputFile);
        this.model.loadModel(model);
        const predictions = this.model.predict(yField, options);

        if (!options.outputPath)
            this.view.write(predictions);
    }
}