import {instance} from "./grid.js";

var banner = document.getElementById("banner");
var title = document.querySelector("#banner > h1");
var mat = document.querySelector("#banner > h2");
var author = document.querySelector("#banner > h3");
var _selection = undefined;

export function update() {
    var score = ctl.stationary * (1 - Math.min(1, instance.mag * 2));
    banner.style.filter = "blur(" + (1 - (score)) * 5 + "px)";
    banner.style.opacity = (score * 2);
    if (instance.selected()) {
        if(instance.selected() != _selection) {
            _selection = instance.selected();
            _update_selection();
        }
        banner.style.transform = "translate(" + instance.selected().x * 0.5 + "px," + instance.selected().y * 0.5 + "px)";
    }
}

function _update_selection() {
    title.textContent = _selection ? _selection.data.title : "";
    mat.textContent = _selection ? _selection.data.mat : "";
    author.textContent = _selection ? _selection.data.author : "";
}