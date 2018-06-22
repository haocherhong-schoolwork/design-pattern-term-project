import fs from 'fs';
import path from 'path';

const noOperation = () => {};

const COMMANDS = [
    'train',
    'predict',
    'help'
]

export default class View {
    // Delegators
    onReadTrain = noOperation;
    onReadPredict = noOperation;

    read() {
        const command = process.argv[2];
        const args = process.argv.slice(3);

        if (COMMANDS.indexOf(command) === -1)
            return this._writeHelp();

        this['_' + command](args);
    }

    writeProgress(rate) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Training progress: ${Math.round(rate * 100)}%`);
        if (rate === 1)
            process.stdout.write('\n');
    }

    writeState(state) {
        console.log(`Training state: ${state}`);
    }

    write(message) {
        console.log(message);
    }

    _writeHelp(filename = 'index.txt') {
        console.log(fs.readFileSync(path.resolve(__dirname, 'help/', filename), 'utf8'));
    }

    _train(args) {
        // handle option: -h
        if (args.indexOf('-h') !== -1)
            return this._writeHelp('train.txt');

        const inputFile = args[0];
        if (!inputFile)
            return console.error('inputFile expected.');

        const yField = args[1];
        if (!yField)
            return console.error('yField expected');

        const options = {};

        // handle option: -o
        const outputIndex = args.indexOf('-o');
        if (outputIndex !== -1) {
            const path = args[outputIndex + 1];
            if (!path)
                return console.error('path after -o expected');
            options.outputPath = path;
        }

        // handle option: -k
        const kernelTypeIndex = args.indexOf('-k');
        if (kernelTypeIndex !== -1) {
            const kernelType = args[kernelTypeIndex +1];
            if (!kernelType)
                return console.error('kernelType after -k expected');
            options.kernelType = kernelType;
        }

        this.onReadTrain(inputFile, yField, options);
    }

    _predict(args) {
        // handle option: -h
        if (args.indexOf('-h') !== -1)
            return this._writeHelp('predict.txt');

        if (!args[0])
            return console.error('inputFile arg expected.');

        const inputFile = args[0];
        if (!inputFile)
            return console.error('inputFile expected.');

        const yField = args[1];
        if (!yField)
            return console.error('yField expected');

        const model = args[2];
        if (!model)
            return console.error('model expected');

        const options = {};

        // handle option: -o
        const outputIndex = args.indexOf('-o');
        if (outputIndex !== -1) {
            const path = args[outputIndex + 1];
            if (!path)
                return console.error('path after -o expected');
            options.outputPath = path;
        }

        this.onReadPredict(inputFile, yField, model, options);
    }

    _help(args) {
        this._writeHelp();
    }

}