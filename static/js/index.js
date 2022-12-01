

// async function getattractionData(url){
//     const response = await fetch(url);
//     const json = await response.json();
//     let data = json.data; 
//     for(i=0;i<data.length;i++){
//         let data = json.data;
//         let name = data[i].name;
//         let mrt = data[i].mrt;
//         let category = data[i].category;
//         let image = data[i].images[0];
        
//         let col = document.createElement("div");
//         col.classList="col";

//         let attractionImg = document.createElement("img");
//         attractionImg.classList= "attractionImg";
//         attractionImg.src = image;
//         col.appendChild(attractionImg);
        
//         let namediv = document.createElement("div");
//         namediv.classList = "namediv"
//         col.appendChild(namediv);

//         let attractionName = document.createElement("div");
//         attractionName.classList = "attractionName"
//         attractionName.textContent = name;
//         namediv.appendChild(attractionName);
        
//         let mrtandcat = document.createElement("div");
//         mrtandcat.classList = "mrtandcat"
//         col.appendChild(mrtandcat);

//         let attractionMrt = document.createElement("div");
//         attractionMrt.classList = "attractionMrt"
//         attractionMrt.textContent = mrt;
//         mrtandcat.appendChild(attractionMrt);

//         let attractionCat = document.createElement("div");
//         attractionCat.classList = "attractionCat"
//         attractionCat.textContent = category;
//         mrtandcat.appendChild(attractionCat);
    
//         attraction.appendChild(col)
//     };
// };

let isLoading = false;
let attraction = document.querySelector(".attraction");
let page = 0;
let url = "/api/attractions?page=" + page;

// 無限滾輪，滾到下一頁

function callback_infinite(entries) { 
    for (const entry of entries){
        // console.log(entry)
        if(entry.isIntersecting){
            if ( page!== null && isLoading == false ){
                
                isLoading = true;
                fetch(url)
                .then(function(response){
                return response.json();
                }).then(function(result){

                // create attraction html
                let data =result.data;
                for(i=0;i<data.length;i++){
                    let name = data[i].name;
                    let mrt = data[i].mrt;
                    let category = data[i].category;
                    let image = data[i].images[0];
                    
                    let col = document.createElement("div");
                    col.classList="col";

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
                };
                
                //換下一頁 url
                page=result.nextPage;
                url = "/api/attractions?page=" + page;

                //這次 fetch 完後，把狀態改為 false
                isLoading=false;
                })
            }else{
                // 取消觀察，以免又觸發下一個 request
                observe.unobserve(footer);
            }
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

let searchInput = document.querySelector(".searchinput");
let searchbutton = document.querySelector(".searchbutton");

searchbutton.addEventListener("click",function(){   
    let keyword = searchInput.value
    let url = `api/attractions?keyword=${keyword}`;
    fetch(url)
    .then(function(response){
    return response.json();
    }).then(function(result){
        
         //清空畫面
         attraction.innerHTML="";
        
         // create attraction html
         let data =result.data;
         if(data.length === 0){
            let html = "";

            html +=` 
            <div class="col">
                <div class = "nodata">查詢不到此景點</div>
            </div>
            `
            console.log(html)
            attraction.innerHTML=html;
         }
         for(i=0;i<data.length;i++){
         let name = data[i].name;
         let mrt = data[i].mrt;
         let category = data[i].category;
         let image = data[i].images[0];
         
         let col = document.createElement("div");
         col.classList="col";
 
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
     };

     observe.disconnect(footer);
    });
})
