let attraction = document.querySelector(".attraction")
let colright = document.querySelector(".col-right");
let url = location.href
let id = url.split("attraction/")[1]
url = "/api/attractions/" + id
let slideIndex = 1;
//create attraction
function createAttraction(data){
    let name = data.name;
    let mrt = data.mrt;
    let category = data.category;
    let imagelist = data.images;
    let description = data.description;
    let address = data.address;
    let transport = data.transport;

    // create appendimg and dot
    for (i in imagelist){
       appendimg(imagelist[i])
    }
    createarrowimg();
    //name,category,mrt 文字
    createtoprightHtml(name,category,mrt)
    //文字段落
    createbottomHtml(description,address,transport);

    showSlides(slideIndex);

};

//fetch url return json data
async function getattractionData(url){
    const response = await fetch(url);
    const json = await response.json();
    let data = json.data; 
    createAttraction(data);
};
getattractionData(url);


let slideshowcontainer = document.querySelector(".slideshow-container");
let dotcontainers = document.createElement("div");
dotcontainers.classList = "dots-container"
let dotcontainer = document.querySelector(".dots-container");
//create appendimg and dot
function appendimg(img){
    let myslidesfade = document.createElement("div");
    myslidesfade.classList = "mySlides fade";
    // myslidesfade.setAttribute("style","display:none");
    let slideimg = document.createElement("img")
    slideimg.classList = "attractionImg"
    slideimg.src = img
    myslidesfade.appendChild(slideimg)
    slideshowcontainer.appendChild(myslidesfade)

    let dot = document.createElement("span");
    dot.classList = "dot"
    // dot.onclick = function(){currentSlide(i)};
    dotcontainers.appendChild(dot)
    slideshowcontainer.appendChild(dotcontainers)
    
}
//arrow img
function createarrowimg(){
    let atag1 = document.createElement("a")
    atag1.classList="prev"
    atag1.onclick = function(){plusSlides(-1)}
    let leftarrowimg = document.createElement("img");
    leftarrowimg.setAttribute("src","/static/img/btn_leftArrow.png")
    leftarrowimg.setAttribute("alt","")
    atag1.appendChild(leftarrowimg)
    let atag2 = document.createElement("a")
    atag2.classList="next"
    atag2.onclick = function(){plusSlides(1)}
    let rightarrowimg = document.createElement("img");
    rightarrowimg.setAttribute("src","/static/img/btn_rightArrow.png")
    rightarrowimg.setAttribute("alt","")
    atag2.appendChild(rightarrowimg)
    slideshowcontainer.appendChild(atag1)
    slideshowcontainer.appendChild(atag2)

    let slideIndex = 1;
    showSlides(slideIndex);
}
//name,category,mrt 文字
function createtoprightHtml(name,category,mrt){   
    let attractionName = document.querySelector(".attractionName")
    let attractionCat = document.querySelector(".attractionCat")
    attractionName.textContent = name;
    attractionCat.textContent = category + "at" + mrt; 
}
//文字段落
function createbottomHtml(description,address,transport){
    let text = document.querySelector(".text");
    let htmlbottom = ""
    htmlbottom+=` 
        <div class="bottom">
            <div class="first">${description}</div>
            <div class="second">
                <div class="title">景點地址:</div>
                <div class="p">${address}</div>
            </div>
            <div class="third">
                <div class="title">交通方式:</div>
                <div class="p">${transport}</div>
            </div>
        </div>
    `
    text.innerHTML= htmlbottom;
}

//不同段不同價錢
let cost = document.querySelector(".cost")
let am = document.querySelector(".am")
let pm = document.querySelector(".pm")
window.onclick = function(event){
    if(event.target == am){
        cost.innerHTML=""
        cost.innerHTML = "新台幣 2000 元"
        pm.checked = false;

    }
    if(event.target == pm){
        cost.innerHTML=""
        cost.innerHTML = "新台幣 2500 元"
        am.checked = false;
    }
}


//照片輪播
function plusSlides(n) {
showSlides(slideIndex += n);
}

function currentSlide(n) {
showSlides(slideIndex = n);
}

function showSlides(n) {
let i;
let slides = document.getElementsByClassName("mySlides");
let dots = document.getElementsByClassName("dot");
if (n > slides.length) {slideIndex = 1}    
if (n < 1) {slideIndex = slides.length}
for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
}
for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
}
slides[slideIndex-1].style.display = "block";  
dots[slideIndex-1].className += " active";
}