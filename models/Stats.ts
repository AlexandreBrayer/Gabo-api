import { Schema, model } from "mongoose";
const StatsModel = new Schema<IStats>({
    games: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    gabo: {
        type: Number,
        default: 0
    },
    lowpen: {
        type: Number,
        default: 0
    },
    contreGabo: {
        type: Number,
        default: 0
    },
    highpen: {
        type: Number,
        default: 0
    },
    lowDownhill: {
        type: Number,
        default: 0
    },
    highDownhill: {
        type: Number,
        default: 0
    }
}).set('toJSON', {
    virtuals: true
});
export default model('Stats', StatsModel);