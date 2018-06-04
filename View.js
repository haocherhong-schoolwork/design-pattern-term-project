import fs from 'fs';

const noOperation = () => {};

export default class View {
    // Delegators
    onReadFilename = noOperation;
    onReadTrain = noOperation;
    onReadOutput = noOperation;

    read() {
        // handle option: -h
        if (process.argv[2] === '-h')
            return this.writeHelp();

        // handle first argument, filename.
        if (!process.argv[2])
            return console.error('filename arg expected.')

        this.onReadFilename(process.argv[2]);

        // handle option: -t
        const trainIndex = process.argv.indexOf('-t');
        if (trainIndex !== -1) {
            const yField = process.argv[trainIndex + 1];
            if (!yField)
                return console.error('yField after -t expected')
            this.onReadTrain(yField);
        }

        // handle option: -o
        if (process.argv.indexOf('-o') !== -1)
            this.onReadOutput();
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

    writeReport(report) {
        console.log(report);
    }

    writeHelp() {
        console.log(fs.readFileSync('help.txt', 'utf8'));
    }
}