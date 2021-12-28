

function start(){
    document.getElementById("canvas").addEventListener("animationend", updateCanvas, false);
}

function buttonStateUpdate(data){
    let canvas = document.getElementById("canvas");
    if (canvas.dataset.displayState === data){
        return;
    } else{
        canvas.dataset.displayState = data
    } 
    let content = null;
    fetch(`${data}.txt`)
    .then(response => response.text())
    .then(newData => 
        {
            canvas.dataset.storedData=newData;
    
            if (canvas.dataset.active == 1){
                primeCanvas(); //html is loaded after animation plays via event listener w/ updateCanvas()
            } else {
                slideOutCenterMenu();
                slideInTopBar();
                canvas.textContent = canvas.dataset.storedData;
                slideInCanvas();
            }
        });
}

function updateCanvas(){
    let canvas = document.getElementById("canvas");

    if (canvas.classList.contains("canupdate1")){
        canvas.textContent = canvas.dataset.storedData;
        canvas.classList.remove("canupdate1");
        canvas.classList.add("canupdate2");
    }
}

function products(){
    buttonStateUpdate("products");
}

function aboutUs(){
    buttonStateUpdate("aboutus");
}


function contact(){
    buttonStateUpdate("contact");
}

function hours(){
    buttonStateUpdate("hours");
}

function otherLink(){
    let canvas = document.getElementById("canvas");
    canvas.dataset.displayState = "";

    slideInCenterMenu();
    slideOutTopBar();
    slideOutCanvas();

}

function slideInTopBar(){
    let t1 = document.getElementById("t1");
    let t2 = document.getElementById("t2");

    t1.classList.remove("slideout");
    t1.classList.add("slidein");

    t2.classList.remove("slideout");
    t2.classList.add("slidein");
}

function slideOutTopBar(){
    let t1 = document.getElementById("t1");
    let t2 = document.getElementById("t2");

    t1.classList.remove("slidein2");
    t1.classList.add("slideout");

    t2.classList.remove("slidein2");
    t2.classList.add("slideout");
}

function slideInCenterMenu(){
    let m1 = document.getElementById("m1");
    let m2 = document.getElementById("m2");

    m1.classList.remove("slideout");
    m1.classList.add("slidein2");

    m2.classList.remove("slideout");
    m2.classList.add("slidein2");
}

function slideOutCenterMenu(){
    let m1 = document.getElementById("m1");
    let m2 = document.getElementById("m2");

    m1.classList.remove("slidein");
    m1.classList.remove("slidein2");
    m1.classList.add("slideout");

    m2.classList.remove("slidein2");
    m2.classList.add("slideout");
}

function slideInCanvas(){
    let canvas = document.getElementById("canvas");

    canvas.classList.remove("canslideout");
    canvas.classList.add("canslidein");
    canvas.dataset.active = 1;
}

function slideOutCanvas(){
    let canvas = document.getElementById("canvas");

    canvas.classList.remove("canslidein");
    canvas.classList.remove("canupdate2");
    canvas.classList.add("canslideout");
    canvas.dataset.active = 0;
}

function primeCanvas(){
    let canvas = document.getElementById("canvas");

    canvas.classList.remove("canslidein");
    canvas.classList.remove("canupdate2");
    canvas.classList.add("canupdate1");
}