import Aggregator from './Aggregator';

export default function combineAggregators(aggregators) {
    const aggregator = new Aggregator();
    aggregator.aggregate = function aggregate (acc, current, index, array) {
        const reuslt = {};
        for(let name in aggregators) {
            const aggregator = aggregators[name];
            reuslt[name] = aggregator.aggregate(acc[name], current, index, array)
        }
        return reuslt;
    }
    return aggregator;
}