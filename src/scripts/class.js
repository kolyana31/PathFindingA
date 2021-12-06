import { resetAfterSearch } from "./helper";

export class Spot {
	constructor(x, y, rect, startPoint, wall = false,width) {
		this.x = x;
		this.y = y;
        this.center = {
            x:x*width+width/2,
            y:y*width+width/2
        }
		this.rect = rect;
		this.startPoint = false;
		this.endPoint = false;
		this.wall = startPoint==null?wall:false;
        this.parent=null

        if(startPoint){
            this.weight = 0;//f
            this.aprocDist;//h
            this.move = 0;//g
            this.parent = NaN
        }

		if (startPoint !== null) {
			this.startPoint = startPoint;
			this.endPoint = !startPoint;
		}

		this.rect.mouseover(() => {
			if (
                !document.SearchMode &&
				document.mouseDown &&
				!document.dragMenu &&
				document.setWallsMode != this.wall &&
				!(this.startPoint || this.endPoint) &&
                !(document.dragStartPointMode|| document.dragEndPointMode)
			) {
				this.rect.animate({ transform: "s1.2" }, 100, () => {
					this.rect.animate({ transform: "s1" }, 100);
				});
				this.wall = !this.wall;
				this.show();
			}
            else if(document.dragStartPointMode){
                if(!this.wall && this.endPoint!==true && !(document.startPoint.x==this.x && document.startPoint.y==this.y)){
                    this.startPoint = true;
                    document.GridArr[document.startPoint.y][document.startPoint.x].startPoint=false;
                    document.GridArr[document.startPoint.y][document.startPoint.x].show();
                    document.startPoint = {x:this.x,y:this.y}
                    this.show();
                }
            }
            else if(document.dragEndPointMode){
                if(!this.wall && this.startPoint!==true && !(document.endPoint.x==this.x && document.endPoint.y==this.y)){
                    this.endPoint = true;
                    document.GridArr[document.endPoint.y][document.endPoint.x].endPoint=false;
                    document.GridArr[document.endPoint.y][document.endPoint.x].show();
                    document.endPoint = {x:this.x,y:this.y}
                    this.show();
                }
            }
		});

		this.rect.mousedown(() => {
            if(document.SearchMode){return}
            if (document.SearchTry) {
                document.SearchTry=false;
                resetAfterSearch();
                document.getElementById("SearchResults").innerHTML = `<i style="color: lightgreen;">Start Search to get results</i>`;
            }
			if (!(this.startPoint || this.endPoint)) {
				this.rect.animate({ transform: "s1.2" }, 100, () => {
					this.rect.animate({ transform: "s1" }, 100);
				});
				this.wall = !this.wall;
				document.setWallsMode = this.wall;
				this.show();
			}
            else if(this.startPoint){
                document.dragStartPointMode = true;
                document.startPoint = {x,y};
            }
            else if(this.endPoint){
                document.dragEndPointMode = true;
                document.endPoint = {x,y};
            }
		});

		this.show();
	}

	show(opList=false,closedList=false) {
		if (this.startPoint) {
            this.weight = 0;
            this.aprocDist;
            this.move = 0;
            this.parent = NaN
			this.rect.attr({ fill: "greenyellow",stroke:"#000",opacity:1,"stroke-width":1});
		}else if(this.endPoint){
			this.rect.attr({ fill: "tomato" , stroke:"#000",opacity:1,"stroke-width":1});
        }else {
			this.rect.attr({ fill: "whitesmoke", stroke: "black", opacity: 0.3,"stroke-width":0.5 });
		}

        if(opList==true && !(this.startPoint || this.endPoint)){
            this.rect.attr({ fill: "yellow", stroke: "black", opacity: 0.3,"stroke-width":0.5 });
        }
        if(closedList==true && !(this.startPoint || this.endPoint)){
            this.rect.attr({ fill: "blue", stroke: "black", opacity: 0.3,"stroke-width":0.5 });
        }

		if (this.wall) {
			this.rect.attr({ fill: "black",opacity: 0.3 });
		}
	}
}
