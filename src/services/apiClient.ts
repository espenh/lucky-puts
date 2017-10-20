import { IPutterScore } from "../contracts/common";

export class LuckyPutsApiClient {
    public getScores(): Promise<IPutterScore[]> {
        return Promise.resolve([]);
    }
}
