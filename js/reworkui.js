// Quarkz - CODE 090 - SYSADMIN
export function sysaccess() {
    function w(ele) {
        return document.getElementById(ele)
    }
    function r(txt,st){
        w("c-output").insertAdjacentHTML("beforeend","<div style = "+st+">"+txt+"</div>")
    }
    function init(){
        r("Ariel","color:pink;align-text:center;")
    }
    function x(){
        const u = w("c-input").value;
    }
    w("c-exec").addEventListener("click",x)
    document.querySelector("body").insertAdjacentHTML("beforeend",
        `<script></script>`
    )
    const cs = console
    // console = {}
    init()
}
