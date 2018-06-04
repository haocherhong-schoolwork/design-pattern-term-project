export default class DataEntry {
    toTrainingData(yField) {
        const x = [];
        let y;
        for (let attr in this) {
            const value = this[attr];
            if (attr === yField) {
                y = value;
            } else {
                x.push(value);
            }
        }
        return [x, y];
    }
}