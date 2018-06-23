import MissingFixer from './MissingFixer';

export default class MeanMissingFixer extends MissingFixer {
    fix(aggregation) {
        return aggregation.mean;
    }
}