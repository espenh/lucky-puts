import * as _ from "lodash";
import * as chroma from "chroma-js";

export const possiblePutPoints = [1, 3, 6, 12, 24];
const colors = chroma.scale(["#ffcf44", "#045d56", "#1e85b8", "#1eb980", "#ff6858"]).colors(possiblePutPoints.length, "hex");
const colorByPoint: _.Dictionary<string> = _.fromPairs(colors.map((color, index) => {
    return [possiblePutPoints[index], color];
}));

export const getPointColorOrDefault = (point: number) => {
    return getPointColor(point) || "gray";
};

export const getPointColor = (point: number) => {
    if (colorByPoint.hasOwnProperty(point)) {
        return colorByPoint[point];
    }

    return undefined;
};
