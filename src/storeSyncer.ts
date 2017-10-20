import * as firebase from "firebase";

import { IAddPutterAction, PutterActionsType } from "./actions/putterActions";
import { IPutter, IRound, IPutterScore } from "./contracts/common";
import { Store } from "react-redux";
import { IAddRoundAction, RoundActionsType } from "./actions/roundActions";
import { ScoreActionsType, ISetScoreForRound } from "./actions/scoreActions";

export class StoreSyncer {
    constructor(private store: Store<any>, private fireStore: firebase.firestore.Firestore) {
        this.fireStore.collection("putters").onSnapshot((snapshot) => {
            snapshot.docChanges.forEach(change => {
                if (change.type === "added" || change.type === "modified") {
                    const putter = change.doc.data() as IPutter;
                    this.store.dispatch<IAddPutterAction>({
                        type: PutterActionsType.addNewPutter,
                        putter
                    });
                }
            });
        });

        this.fireStore.collection("rounds").onSnapshot((snapshot) => {
            snapshot.docChanges.forEach(change => {
                if (change.type === "added" || change.type === "modified") {
                    const round = change.doc.data() as IRound;
                    this.store.dispatch<IAddRoundAction>({
                        type: RoundActionsType.addNewRound,
                        round: round
                    });
                }
            });
        });

        this.fireStore.collection("scores").onSnapshot((snapshot) => {
            snapshot.docChanges.forEach(change => {
                if (change.type === "added" || change.type === "modified") {
                    const score = change.doc.data() as IPutterScore;
                    this.store.dispatch<ISetScoreForRound>({
                        type: ScoreActionsType.setScoreForRound,
                        score: score
                    });
                }
            });
        });
    }
}
