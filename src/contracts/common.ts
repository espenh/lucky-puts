
export interface IStringDictionary<T> {
    [key: string]: T;
}

export interface INumberDictionary<T> {
    [key: number]: T;
}

export interface IApplicationState {
    sync: ISyncState;
    putters: IPutterState;
    round: IRoundState;
    score: IScoreState;
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

export interface ISyncState {
    isSyncing: boolean;
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
    roundId: string;
    putterId: string;
    score: Score;
}

export type Score = number;
