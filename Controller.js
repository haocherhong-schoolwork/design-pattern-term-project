export default class Controller {
    view;
    model;

    constructor(view, model) {
        this.model = model;
        this.view = view;

        this.model.onProgressUpdated = this.onProgressUpdated;
        this.model.onStateUpdated = this.onStateUpdated;

        this.view.onReadFilename = this.loadFile;
        this.view.onReadTrain = this.train;
    }

    onProgressUpdated = () => {
        this.view.writeProgress(this.model.trainingProgress);
    }

    onStateUpdated = () => {
        this.view.writeState(this.model.trainingState);
    }

    loadFile = filename => {
        this.model.loadCSV(filename);
    }

    train = yField => {
        this.model.train(yField);
    }
}