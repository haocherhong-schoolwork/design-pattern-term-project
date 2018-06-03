export default class Controller {
    view;
    model;

    shouldOutputReport = false;

    constructor(view, model) {
        this.model = model;
        this.view = view;

        this.model.onProgressUpdated = this.onProgressUpdated;
        this.model.onStateUpdated = this.onStateUpdated;

        this.view.onReadFilename = this.handleReadFilename;
        this.view.onReadTrain = this.handleReadTrain;
        this.view.onReadOutput = this.handleReadOutput;
    }

    onProgressUpdated = () => {
        this.view.writeProgress(this.model.trainingProgress);
    }

    onStateUpdated = () => {
        this.view.writeState(this.model.trainingState);
        if (this.model.trainingState === 'DONE' && this.shouldOutputReport)
            this.view.writeReport(this.model.trainingReport);
    }

    handleReadFilename = filename => {
        this.model.loadCSV(filename);
    }

    handleReadTrain = yField => {
        this.model.train(yField);
    }

    handleReadOutput = () => {
        this.shouldOutputReport = true;
    }
}