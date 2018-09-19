import { RouterState } from "react-router-redux";

export interface IStringDictionary<T> {
    [key: string]: T;
}

export interface INumberDictionary<T> {
    [key: number]: T;
}

export interface IApplicationState {
    putters: IPutterState;
    round: IRoundState;
    score: IScoreState;
    router: RouterState;
}

export interface IPutterState {
    puttersById: IStringDictionary<IPutter>;
}

export interface IScoreState {
    scores: IPutterScore[];
}

export interface IRoundState {
    rounds: IRound[];
}

export interface IRound {
    id: string;
    dateInUnixMsTicks: number;
}

export interface IPutter {
    id: string;
    name: string;
    image: string | null;
}

export interface IPutterScore {
    id: string;
    putterId: string;
    registerDateInUnixMs: number;
    roundDate: number;
    score: number;
}

export type Score = number;

export interface IRoundScore {
    putter: IPutter;
    score: IPutterScore;
}

export interface IScoreAggregation {
    scores: IRoundScore[];
    scoreSum: number;
    highestScore: IRoundScore;
    putter: IPutter;
}
