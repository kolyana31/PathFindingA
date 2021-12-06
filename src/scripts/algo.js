import Raphael from "raphael";
import { Spot } from "./class";
import {
	Manhatan,
	EuclidianDistance,
	EuclidianDistanceSquared,
	SearchToogle,
	getNeighbors,
} from "../scripts/helper";

const HevristicMethod = {
	1: Manhatan,
	2: EuclidianDistance,
	3: EuclidianDistanceSquared,
};

let paper = Raphael(
	0,
	0,
	document.documentElement.clientWidth,
	document.documentElement.clientHeight - 1
);
let WH = 30;
document.PossWAmount = document.documentElement.clientWidth / WH;
document.PossHAmount = document.documentElement.clientHeight / WH;

document.resultPath = paper.path();
document.GridArr = [];

for (let y = 0; y < document.PossHAmount; y++) {
	let tmp = [];
	for (let x = 0; x < document.PossWAmount; x++) {
		let el;
		if (
			y == Math.floor(document.PossHAmount / 2) &&
			x == Math.floor(document.PossWAmount / 2.5) &&
			!document.StartPoint
		) {
			el = new Spot(x, y, paper.rect(x * WH, y * WH, WH, WH), true, false, WH);
			document.startPoint = { x, y };
		} else if (
			y == Math.floor(document.PossHAmount / 2) &&
			x == Math.floor(document.PossWAmount / 1.5) &&
			!document.EndPoint
		) {
			el = new Spot(x, y, paper.rect(x * WH, y * WH, WH, WH), false, false, WH);
			document.endPoint = { x, y };
		} else {
			el = new Spot(
				x,
				y,
				paper.rect(x * WH, y * WH, WH, WH),
				null,
				Math.random() < 0.0,
				WH
			);
		}
		tmp.push(el);
	}
	document.GridArr.push(tmp);
}

export const FindPath = () => {
	let openList = [
		document.GridArr[document.startPoint.y][document.startPoint.x],
	];
	let closedList = [];
	let found = false;

	let interationsC = 0;

	document.SearchResults = {};
	document.getElementById(
		"SearchResults"
	).innerHTML = `<i style="color: orange;">Processing...</i>`;

	let interval = setInterval(() => {
		if (document.SearchCanceled) {
			clearInterval(interval);
			SearchToogle();
			document.SearchCanceled = false;
			return;
		}
		if (document.SearchPause) {
			return;
		}
		if (openList.length == 0 || found) {
			if (!found) {
				document.SearchResults = null;
				document.getElementById(
					"SearchResults"
				).innerHTML = `<i style="color: tomato;">Can\`t find path</i>`;
			} else {
				document.getElementById(
					"SearchResults"
				).innerHTML = `<i style="color: lightgreen;">
                        Step weight Hor/Ver: ${document.GridStep} <br>
                        Step weight Diag: ${(document.GridStep * Math.SQRT2).toFixed(2)} <br>
                        Iterations: ${interationsC} <br>
                        Steps: ${document.SearchResults.steps} <br>
                        Path Weight: ${document.SearchResults.pathLength.toFixed(2)} <br>
                    </i>`;
			}
			clearInterval(interval);
			SearchToogle();
			return;
		}

		//-------------- start *WHILE* ---------------------

		let q = openList.reduce(function (prev, curr) {
			return prev.weight < curr.weight ? prev : curr;
		});

		if (
			q.x == document.endPoint.x &&
			q.y == document.endPoint.y
		){
			let tmp = document.GridArr[q.y][q.x];
			document.SearchResults.steps = 0;
			document.SearchResults.pathLength = tmp.move;
			let str = `M${tmp.center.x} ${tmp.center.y}`;
			while (tmp?.parent) {
				document.SearchResults.steps++;
				str += `L${tmp.center.x} ${tmp.center.y}M${tmp.center.x} ${tmp.center.y}`;
				tmp = tmp.parent;
			}
			str += `L${tmp.center.x} ${tmp.center.y}`;
			document.resultPath = paper.path(str);
			found = true;
			return;
		}

		interationsC++;
		openList = openList.filter((el) => !(el.x == q.x && el.y == q.y));
		closedList.push(q);

		let neighbors = getNeighbors(q);
		for (let i = 0; i < neighbors.length; i++) {

			let CPLSS = closedList.find(
				el => (el.x == neighbors[i].x && el.y == neighbors[i].y)
			);
			if (CPLSS) {
				continue;
			}

			let is_better = false;
			let ng = q.move +
			(document.GridArr[neighbors[i].y][neighbors[i].x].x - q.x === 0 ||
			document.GridArr[neighbors[i].y][neighbors[i].x].y - q.y === 0
				? document.GridStep
				: Math.SQRT2);

			let OPLSS = openList.findIndex(
				el => (el.x == neighbors[i].x && el.y == neighbors[i].y)
			);
			if (OPLSS === -1) {
				is_better=true;
				openList.push(document.GridArr[neighbors[i].y][neighbors[i].x]);
			}else{
				if (ng < document.GridArr[neighbors[i].y][neighbors[i].x].move) {
					is_better=true;
				}
			}
			if (is_better) {
				document.GridArr[neighbors[i].y][neighbors[i].x].parent = q;
				document.GridArr[neighbors[i].y][neighbors[i].x].move = ng;
				document.GridArr[neighbors[i].y][neighbors[i].x].aprocDist =
					HevristicMethod[document.Method](
						document.GridArr[neighbors[i].y][neighbors[i].x],
						document.endPoint
					);
				document.GridArr[neighbors[i].y][neighbors[i].x].weight =
					document.GridArr[neighbors[i].y][neighbors[i].x].move +
					document.GridArr[neighbors[i].y][neighbors[i].x].aprocDist;
			}

		}
		openList.forEach((el, i) => {
			document.GridArr[el.y][el.x].show(true);
		});
	}, 30);
};
