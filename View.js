export default class View {
    onReadFilename; // Delegator
    onReadTrain; // Delegator

    read() {
        if (!process.argv[2])
            return console.error('filename arg expected.')

        this.onReadFilename(process.argv[2]);

        const trainIndex = process.argv.indexOf('-t');
        if (trainIndex !== -1) {
            const yField = process.argv[trainIndex + 1];
            if (!yField)
                return console.error('yField after -t expected')
            this.onReadTrain(yField);
        }
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
}