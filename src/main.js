import './styles/style.css'

import { dragElement,SearchToogle,resetAfterSearch } from "./scripts/helper";
import { FindPath } from "./scripts/algo";

dragElement(document.getElementById("detachedMenu"));

document.mouseDown = false;
document.GridStep = 10;
document.Method = document.querySelector('input[name="methods"]:checked').value;
document.SearchMode = false;
document.SearchTry =false;
document.AllowDiagonale = true;
document.SearchPause = false;
document.SearchResults = {};

document.getElementById("AllowDiagonale").addEventListener("change",({target})=>{
  document.AllowDiagonale = target.checked;
})

document.addEventListener("mousedown",()=>{
  document.mouseDown = true;
})

document.addEventListener("mouseup",()=>{
  document.mouseDown = false;
  document.dragStartPointMode = false;
  document.dragEndPointMode = false;
})

document.getElementById("MethodsForm").addEventListener("change",({target})=>{
  document.Method= target.value;
})

document.getElementById("ClearWalls").addEventListener("click",()=>{
  if (document.SearchPause) {
    document.SearchPause = false;
    document.SearchCanceled = true;
    resetAfterSearch();
    document.getElementById("ClearWalls").innerText = document.SearchPause?"Cancel Search":"Clear Field";
  }
  else{
    resetAfterSearch();
    document.GridArr.forEach(ar2 => {
        ar2.forEach(el=>{
            el.wall = false;
            el.show();
        })
    });
  }
  document.getElementById("SearchResults").innerHTML = `<i style="color: lightgreen;">Start Search to get results</i>`;
})

document.getElementById("Pause").addEventListener("click",({target})=>{
  document.SearchPause = !document.SearchPause;
  target.innerText = document.SearchPause?"Resume Search":"Pause Search";
  document.getElementById("ClearWalls").innerText = document.SearchPause?"Cancel Search":"Clear Field";
  if (document.SearchPause && document.SearchMode) {
    document.getElementById("ClearWalls").removeAttribute("disabled");
  }
  else if(document.SearchMode){
    document.getElementById("ClearWalls").setAttribute("disabled",true);
  }
})

document.getElementById("SearchStarter").addEventListener("click",()=>{
  if (!document.SearchMode) {
    document.SearchTry = true;
    SearchToogle();
    resetAfterSearch();
    FindPath();
  }
})

