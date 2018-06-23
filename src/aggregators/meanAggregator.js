import Aggregator from './Aggregator';

export default class MeanAggregator extends Aggregator {
    aggregate(acc, current, index, array) {
        if (index === 0) {
            // First iteration
            return current;
        } else if (index < array.length - 1) {
            // Index-th iteration
            return acc + current;
        } else {
            // Last iteration
            return (acc + current) / array.length
        }
    }
}