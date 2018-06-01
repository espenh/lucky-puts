import * as firebase from "firebase";
import * as _ from "lodash";
import { Store } from "react-redux";

import { IAddPutterAction, PutterActionsType } from "./actions/putterActions";
import { IAddRoundAction, RoundActionsType } from "./actions/roundActions";
import { ISetScoreForRound, ScoreActionsType } from "./actions/scoreActions";
import { IPutter, IPutterScore, IRound } from "./contracts/common";

export class StoreSyncer {
    constructor(private store: Store<any>, private fireStore: firebase.firestore.Firestore) {

        this.fireStore.collection("putters").onSnapshot((snapshot) => {
            const addedChanges = _.filter(snapshot.docChanges(), change => change.type === "added" || change.type === "modified");
            const addedPutters = _.map(addedChanges, change => change.doc.data() as IPutter);

            this.store.dispatch<IAddPutterAction>({
                type: PutterActionsType.addNewPutter,
                putters: addedPutters
            });
        });

        this.fireStore.collection("rounds").onSnapshot((snapshot) => {
            const addedChanges = _.filter(snapshot.docChanges(), change => change.type === "added" || change.type === "modified");
            const addedRounds = _.map(addedChanges, change => change.doc.data() as IRound);

            this.store.dispatch<IAddRoundAction>({
                type: RoundActionsType.addNewRound,
                rounds: addedRounds
            });
        });

        this.fireStore.collection("scores").onSnapshot((snapshot) => {
            const addedChanges = _.filter(snapshot.docChanges(), change => change.type === "added" || change.type === "modified");
            const addedScores = _.map(addedChanges, change => change.doc.data() as IPutterScore);

            this.store.dispatch<ISetScoreForRound>({
                type: ScoreActionsType.setScoreForRound,
                scores: addedScores
            });
        });
    }
}
