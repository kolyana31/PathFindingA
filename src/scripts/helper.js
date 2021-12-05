

export function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    document.dragMenu = true;
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    if (elmnt.offsetLeft+elmnt.offsetWidth <= document.documentElement.clientWidth-10) {
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    else if(elmnt.offsetLeft+elmnt.offsetWidth >= document.documentElement.clientWidth-10){
        elmnt.style.left = (document.documentElement.clientWidth - elmnt.offsetWidth -20) + "px";
        closeDragElement();
    }
    if(elmnt.offsetLeft <= 0){
        elmnt.style.left = 20 + "px";
        closeDragElement();
    }
    if (elmnt.offsetTop+elmnt.offsetHeight <= document.documentElement.clientHeight - 10) {
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }
    else if(elmnt.offsetTop+elmnt.offsetHeight >= document.documentElement.clientHeight-10){
        elmnt.style.top = (document.documentElement.clientHeight - elmnt.offsetHeight -20) + "px";
        closeDragElement();
    }
    if(elmnt.offsetTop <= 0){
        elmnt.style.top = 20 + "px";
        closeDragElement();
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.dragMenu = false;
  }
}

export function Manhatan(p1,p2) {
  return (Math.abs(p1.x-p2.x) + Math.abs(p1.y-p2.y))*document.GridStep;
}

export function EuclidianDistance(p1,p2) {
  let dx  = Math.abs(p1.x-p2.x);
  let dy  = Math.abs(p1.y-p2.y);
  return Math.sqrt(dx*dx+dy*dy)*document.GridStep;
}

export function EuclidianDistanceSquared(p1,p2) {
  return (Math.pow(p1.x - p2.x, 2.0) + Math.pow(p1.y - p2.y, 2.0))*document.GridStep;
}

export const SearchToogle = () =>{
  if (document.SearchMode) {
    document.getElementById("SearchStarter").removeAttribute("disabled");
    document.getElementById("ClearWalls").removeAttribute("disabled");
    document.getElementById("Pause").setAttribute("disabled",true);
    Array.from(document.querySelectorAll('input[name="methods"]')).forEach(element => {
      element.removeAttribute("disabled");
    }); 
    document.SearchMode=false;
    document.SearchPause = false;
  }
  else{
    document.getElementById("ClearWalls").setAttribute("disabled",true);
    document.getElementById("SearchStarter").setAttribute("disabled",true);
    document.getElementById("Pause").removeAttribute("disabled")
    Array.from(document.querySelectorAll('input[name="methods"]')).forEach(element => {
      element.setAttribute("disabled",true);
    }); 
    document.SearchMode=true;
  }
}

export const resetAfterSearch = ()=>{
  document.resultPath.remove();
  document.GridArr.forEach(ar2 => {
      ar2.forEach(el=>{
          if (el.startPoint==false) {
            el.parent = null;
            el.weight = 0;
            el.aprocDist;
            el.move = 0;
            el.show();
          }
      })
  });
}