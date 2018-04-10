import * as moment from "moment";

export class DateUtils {

    /**
     * @to: Exclusive
     */
    public static getDatesBetween(from: moment.Moment, to: moment.Moment): moment.Moment[] {
        const dates: moment.Moment[] = [];

        let cursor = from.clone();
        while (cursor.isBefore(to)) {
            dates.push(cursor.clone());
            cursor = cursor.add(1, "day");
        }

        return dates;
    }
}

export class Continuous<Thing> {

    private previousThingInCurrentChain: Thing | undefined;
    private longestChain: Thing[];
    private currentChain: Thing[];

    constructor(private isContinuous: (previousThing: Thing, currentThing: Thing) => boolean) {
        this.longestChain = [];
        this.currentChain = [];
    }

    public get longest() {
        return this.longestChain;
    }

    public get length() {
        return this.longestChain.length;
    }

    public addOrdered(thing: Thing) {
        if (!this.previousThingInCurrentChain || this.isContinuous(this.previousThingInCurrentChain, thing)) {
            this.currentChain.push(thing);
        } else {
            this.currentChain = [thing];
        }

        if (this.currentChain.length >= this.longestChain.length) {
            this.longestChain = this.currentChain;
        }

        this.previousThingInCurrentChain = thing;
    }
}
