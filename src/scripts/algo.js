import Raphael from "raphael";
import { Spot } from "./class";
import { Manhatan,EuclidianDistance,EuclidianDistanceSquared, SearchToogle } from "../scripts/helper";

const HevristicMethod ={
    1:Manhatan,
    2:EuclidianDistance,
    3:EuclidianDistanceSquared
}

let paper = Raphael(
	0,
	0,
	document.documentElement.clientWidth,
	document.documentElement.clientHeight - 1
);
let WH = 30;
let PossWAmount = document.documentElement.clientWidth / WH;
let PossHAmount = document.documentElement.clientHeight / WH;

document.resultPath = paper.path();
document.GridArr = [];

for (let y = 0; y < PossHAmount; y++) {
	let tmp = [];
	for (let x = 0; x < PossWAmount; x++) {
		let el;
		if (
			y == Math.floor(PossHAmount / 2) &&
			x == Math.floor(PossWAmount / 2.5) &&
			!document.StartPoint
		) {
			el = new Spot(
				x,
				y,
				paper.rect(x * WH, y * WH, WH, WH),
				true,
				false,
                WH
			);
			document.startPoint = { x, y };
			console.log(document.startPoint);
		} else if (
			y == Math.floor(PossHAmount / 2) &&
			x == Math.floor(PossWAmount / 1.5) &&
			!document.EndPoint
		) {
			el = new Spot(x, y, paper.rect(x * WH, y * WH, WH, WH), false,false,WH);
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

    document.SearchResults={};
    document.getElementById("SearchResults").innerHTML = `<i style="color: orange;">Processing...</i>`;

    let interval = setInterval(()=>{
        if (document.SearchCanceled) {
            clearInterval(interval);
            SearchToogle();
            document.SearchCanceled=false;
            return;
        }
        if(document.SearchPause){
            return;
        }
        if (openList.length==0 || found) {
            if (!found) {
                document.SearchResults = null;
                document.getElementById("SearchResults").innerHTML = `<i style="color: tomato;">Can\`t find path</i>`;
            }
            else{
                document.getElementById("SearchResults").innerHTML =
                    `<i style="color: lightgreen;">
                        Step weight Hor/Ver: ${document.GridStep} <br>
                        Step weight Diag: ${document.GridStep*1.4} <br>
                        Iterations: ${interationsC} <br>
                        Steps: ${document.SearchResults.steps} <br>
                        Path Weight: ${document.SearchResults.pathLength} <br>
                    </i>`;
            }
            clearInterval(interval);
            SearchToogle();
            return;
        }

        interationsC++;

        let q = openList.reduce(function (prev, curr) {
			return prev.weight < curr.weight ? prev : curr;
		});

		openList = openList.filter((el) => !(el.x == q.x && el.y == q.y));
		closedList.push(q);

		for (let i = q.x - 1; i <= q.x + 1; i++) {
			if (found) {
				break;
			}
			for (let j = q.y - 1; j <= q.y + 1; j++) {
				if (
					i >= 0 &&
					i < document.GridArr[0].length &&
					j >= 0 &&
					j < document.GridArr.length
				) {
                    if (document.AllowDiagonale==false && (
                        (i==q.x+1 && j==q.y+1) ||
                        (i==q.x-1 && j==q.y+1) ||
                        (i==q.x-1 && j==q.y-1) ||
                        (i==q.x+1 && j==q.y-1)
                    )) {
                        continue;
                    }
					if (
						!(i == q.x && j == q.y) &&
						!document.GridArr[j][i].wall &&
						document.GridArr[j][i].parent == null &&
						!(
                            (document.GridArr?.[q.y]?.[q.x+1]?.wall &&
								document.GridArr?.[q.y+1]?.[q.x]?.wall && (i==q.x+1 && j==q.y+1)) ||

                            (document.GridArr?.[q.y]?.[q.x-1]?.wall &&
                                document.GridArr?.[q.y+1]?.[q.x]?.wall && (i==q.x-1 && j==q.y+1)) ||

                            (document.GridArr?.[q.y]?.[q.x-1]?.wall &&
                                document.GridArr?.[q.y-1]?.[q.x]?.wall && (i==q.x-1 && j==q.y-1)) ||

                            (document.GridArr?.[q.y-1]?.[q.x]?.wall &&
                                document.GridArr?.[q.y]?.[q.x+1]?.wall && (i==q.x+1 && j==q.y-1))
						)
					) {
						document.GridArr[j][i].parent = q;
						document.GridArr[j][i].move = q.move;
						if (
							((document.GridArr[j][i].x < q.x ||
								document.GridArr[j][i].x > q.x) &&
								document.GridArr[j][i].y == q.y) ||
							((document.GridArr[j][i].y < q.y ||
								document.GridArr[j][i].y > q.y) &&
								document.GridArr[j][i].x == q.x)
						) {
							document.GridArr[j][i].move += document.GridStep;
						} else {
							document.GridArr[j][i].move += document.GridStep * 1.4;
						}
						document.GridArr[j][i].aprocDist = HevristicMethod[document.Method](
							{ x: document.GridArr[j][i].x, y: document.GridArr[j][i].y },
							document.endPoint
						);
						document.GridArr[j][i].weight =
							document.GridArr[j][i].aprocDist + document.GridArr[j][i].move;
						if (
							document.GridArr[j][i].x == document.endPoint.x &&
							document.GridArr[j][i].y == document.endPoint.y
						) {
							found = true;
                            let tmp = document.GridArr[j][i];
                            document.SearchResults.steps= 0;
                            document.SearchResults.pathLength = tmp.move;
                            let str=`M${tmp.center.x} ${tmp.center.y}`;
                            while(tmp?.parent){
                                document.SearchResults.steps++;
                                str+=`L${tmp.center.x} ${tmp.center.y}M${tmp.center.x} ${tmp.center.y}`
                                tmp = tmp.parent;
                            }
                            str+=`L${tmp.center.x} ${tmp.center.y}`
                            document.resultPath = paper.path(str);
							break;
						}
						openList.push(document.GridArr[j][i]);
					}
				}
			}
		}
		openList.forEach((el, i) => {
			document.GridArr[el.y][el.x].show(true);
		});
    },30)
};
