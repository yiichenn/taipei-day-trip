let attraction = document.querySelector(".attraction")
let text = document.querySelector(".text");
// let attractionName = document.querySelector(".attractionName")
// let attractionCat = document.querySelector("attractionCat")
let url = location.href
let id = url.split("attraction/")[1]
url = "/api/attractions/" + id
//create attraction
function createAttraction(data){
    console.log(data)
    let name = data.name;
    let mrt = data.mrt;
    let category = data.category;
    let image = data.images[0];
    let description = data.description;
    let address = data.address;
    let transport = data.transport;

    // attractionName.textContent = name;
    // attractionCat.textContent = `${category} at ${mrt}`; 
    
    let htmltopright = "";
    // <div class="col-right">
    //             <img class="attractionImg" src=${image} alt="" />
    //     </div>
    htmltopright +=` 
        <div class="col-right">
            <div class="slideshow-container">

                <div class="mySlides fade" style="display:block">
                <img  class="attractionImg" src="https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000848.jpg">
                </div>
            
                <div class="mySlides fade" style=display:none>
                <img  class="attractionImg" src="https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg">
                </div>
            
                <div class="mySlides fade" style=display:none>
                <img class="attractionImg" src="https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D7/E150/F719/71eb4b56-f771-43bc-856c-2fb265a5cc6e.jpg" >
                </div>
            
                <a class="prev" onclick="plusSlides(-1)"><img src="/static/img/btn_leftArrow.png" alt=""/></a>
                <a class="next" onclick="plusSlides(1)"><img src="/static/img/btn_rightArrow.png" alt=""/></a>
            
                <div  class="dots-container">
                    <span class="dot" onclick="currentSlide(1)"></span> 
                    <span class="dot" onclick="currentSlide(2)"></span> 
                    <span class="dot" onclick="currentSlide(3)"></span> 
                </div>
            
            </div>
        </div>
        <div class="col-left">
            <div class="attractionName">${name}</div>
            <div class="attractionCat">${category} at ${mrt}</div>
            
            <div class="form">
                <div class="one">訂購導覽行程</div>
                <div class="two">以此景點為中心的一日行程，帶您探索城市角落故事</div>
                <span class="three">選擇日期:</span> <input  type="date">
                <div class="four">選擇時間: <input type="radio"/>上半天<input type="radio"/>下半天</div>
                <div class="five">導覽費用:請選擇費用</div>
                <div class="six">開始預約行程</div>
            </div>
        </div>
    `
    attraction.innerHTML= htmltopright;
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
};


//fetch url return json data
async function getattractionData(url){
    const response = await fetch(url);
    const json = await response.json();
    let data = json.data; 
    createAttraction(data);
};
getattractionData(url);

let slideIndex = 1;
showSlides(slideIndex);

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
