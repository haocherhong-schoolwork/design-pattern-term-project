export default function combineAggregators(aggregators) {
    return function(acc, current, index, array) {
        const reuslt = {};
        for(let name in aggregators) {
            const aggregator = aggregators[name];
            reuslt[name] = aggregator(acc[name], current, index, array)
        }
        return reuslt;
    }
}