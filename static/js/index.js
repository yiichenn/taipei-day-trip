let attraction = document.querySelector(".attraction");
let searchInput = document.querySelector(".searchinput");
let keyword = searchInput.value
let page = 0;
let url = `api/attractions?page=${page}&keyword=${keyword}`
// create attraction
function createAttraction(data){
    for(i=0;i<data.length;i++){
        let id = data[i].id
        let name = data[i].name;
        let mrt = data[i].mrt;
        let category = data[i].category;
        let image = data[i].images[0];
        
        let col = document.createElement("a");
        col.classList="col";
        col.id=id;
        col.setAttribute("href", `attraction/${id}`)
        col.setAttribute("style", "text-decoration:none")
        
        let attractionImg = document.createElement("img");
        attractionImg.classList= "attractionImg";
        attractionImg.src = image;
        col.appendChild(attractionImg);
        
        let namediv = document.createElement("div");
        namediv.classList = "namediv"
        col.appendChild(namediv);

        let attractionName = document.createElement("div");
        attractionName.classList = "attractionName"
        attractionName.textContent = name;
        namediv.appendChild(attractionName);
        
        let mrtandcat = document.createElement("div");
        mrtandcat.classList = "mrtandcat"
        col.appendChild(mrtandcat);

        let attractionMrt = document.createElement("div");
        attractionMrt.classList = "attractionMrt"
        attractionMrt.textContent = mrt;
        mrtandcat.appendChild(attractionMrt);

        let attractionCat = document.createElement("div");
        attractionCat.classList = "attractionCat"
        attractionCat.textContent = category;
        mrtandcat.appendChild(attractionCat);
    
        attraction.appendChild(col)
    }
}

//滾輪
function callback_infinite(entries){ 
    for (const entry of entries){
        // console.log(entry)
        if(entry.isIntersecting){
            fetch(url).then(function(response){
            return response.json();})
            .then(function(result){
            // create attraction html
            let data =result.data;
            createAttraction(data);
            //換下一頁 url，確認有沒有 keyword
            if(keyword){
                page = result.nextPage;
                url = `api/attractions?page=${page}&keyword=${keyword}`
            }else{
                page = result.nextPage
                url = `api/attractions?page=${page}&keyword=${keyword}`
            }
            //觀察有沒有下一頁
            nextPage = result.nextPage
            if(nextPage == null){
                // 取消觀察，以免又觸發下一個 request
                observe.unobserve(footer);
            }})
        }
    } 
}
//建立觀察器
const footer = document.querySelector(".copyright")
const observe = new IntersectionObserver(callback_infinite, {
    threshold: 0.9,
 });
observe.observe(footer);

//關鍵字搜尋
let searchbutton = document.querySelector(".searchbutton");
searchbutton.addEventListener("click",function(){
    keyword = searchInput.value
    page = 0
    url =`api/attractions?page=${page}&keyword=${keyword}`
    fetch(url).then(function(response){
    return response.json();
    }).then(function(result){
        //清空畫面
        attraction.innerHTML="";
        //確認下一頁
        nextPage = result.nextPage
        // 沒有關鍵字的畫面
        let data =result.data;
        if(data.length === 0){
        let html = "";
        html +=`<div class="col">
                    <div class = "nodata">沒有結果</div>
                </div>`
        attraction.innerHTML=html;
        }
        else{
            observe.observe(footer);
        }
   
    })
})

let categoryApi = "/api/categories";
let searchCategory = document.querySelector(".searchcategory");

//1.製作分類的搜尋欄，並隱藏
function category(){
    fetch(categoryApi).then(function(response){
        return response.json();})
        .then(function(result){
        let categoryList =result.data;
        categoryList.forEach(categorybutton);
        function categorybutton(category){       
            let col = document.createElement("div");
            col.classList="categorybutton";
            col.setAttribute("style", "cursor: pointer;")
            col.textContent = category;
            searchCategory.appendChild(col)
        }
        // 把分類的字放到 searchbar
        let categoryButton = document.querySelectorAll(".categorybutton");
        categoryButton.forEach(showtext);
        function showtext(button){
            let text = button.innerText
            button.addEventListener("click",function(){
            searchInput.value = text
            searchCategory.style.display="none"
            })
        }
    })
    
    searchCategory.style.display="none"

}
category();
//2.點輸入框顯示分類欄，或是點其它地方隱藏
window.onclick = function(event) {
    if(event.target == searchInput){
        searchCategory.style.display="grid"
    }else{
        searchCategory.style.display="none"
    }     
}
  