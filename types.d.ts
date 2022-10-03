declare module 'cors';
interface RegisterPayload {
    name?: string;
    password?: string;
    email?: string;
}

interface LoginPayload {
    name?: string;
    password?: string;
}

interface IUser {
    name : string;
    email : string;
    password : string;
    games : Array<ObjectId>;
    token : string;
    type : string;
}

interface IRound {
    players : Array<ObjectId>;
    scores: any;
    gabo: Array<ObjectId>;
    lowpen: Array<ObjectId>;
    contreGabo: Array<ObjectId>;
    highpen: Array<ObjectId>;
    lowDownhill: Array<ObjectId>;
    highDownhill: Array<ObjectId>;
}

interface IGame {
    players : Array<ObjectId>;
    winner : ObjectId;
    loser : ObjectId;
    scores: any;
    rounds: Array<ObjectId>;
    timestamp: number;
}