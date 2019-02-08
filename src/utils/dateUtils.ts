import moment from "moment";

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

    public static getDate(date: number) {
        return moment(date, "YYYYMMDD");
    }

    public static getDateAsNumber(date: moment.Moment) {
        return parseInt(date.format("YYYYMMDD"), 10);
    }

    public static isRedDay(day: moment.Moment) {
        const isoWeekDay = day.isoWeekday();
        if (isoWeekDay === 6 /* saturday */ || isoWeekDay === 7 /* sunday */) {
            return true;
        }

        // TODO - Quick 17th of may example. Move red days to a separate module. Note .month is 0-based.
        if (day.month() === 4 && day.date() === 17) {
            return true;
        }

        return false;
    }

    public static getFriendlyRelativeDate(date: moment.Moment) {
        const now = moment().startOf("day");
        const diffInDays = now.diff(date, "day");

        if (diffInDays === 0) {
            return "Today";
        }

        if (diffInDays === -1) {
            return "Tomorrow";
        }

        if (diffInDays === 1) {
            return "Yesterday";
        }

        return date.format("dddd, Do MMMM YYYY");
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
