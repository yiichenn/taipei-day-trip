///login
let loginBtn = document.querySelector(".login-btn")
let registerBtn = document.querySelector(".resister-btn")
let logoutBtn = document.querySelector(".logout-btn")
let signin = document.querySelector(".sign-in")
let register = document.querySelector(".register")
let navlogin = document.querySelector(".navlogin")
let bodybackground = document.querySelector(".body-backgroung")
function showlogin(){
    signin.style.display = "block"
    register.style.display = "none"
    bodybackground.style.display="block"
}
function closelogin(){
    signin.style.display = "none"
    bodybackground.style.display="none"
}

function showregister(){
    register.style.display = "block"
    signin.style.display = "none"
    bodybackground.style.display="block"
}
  
function closeresister(){
    register.style.display = "none"
    bodybackground.style.display="none"
}
function clicktoregister(){
    signin.style.display = "none"
    register.style.display = "block"
}
function clicktosignin(){
    signin.style.display = "block"
    register.style.display = "none"
}

//註冊
function registerbtn(){
    let name = document.querySelector(".register-input-name").value
    let email = document.querySelector(".register-input-mail").value
    let password = document.querySelector(".register-input-password").value
    data ={
        "name":name,
        "email": email,
        "password":password,
    };
    fetch("/api/user",{
        method: "POST",
        body:JSON.stringify(data),
        headers:{
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        }
    })
    .then(function(response){
        return response.json()
    })
    .then(function(res){
        let registertext = document.querySelector(".register-alert")
        if (res.ok == true){
            registertext.textContent = "註冊成功，請登入頁面"
        }else{
            registertext.textContent = "此 email 已被註冊"
        }
    })
}
//檢查登入狀態
fetch("/api/user/auth",{
    method: "GET",
})
.then(function(response){
    return response.json();
})
.then(function(res){
    if (res.data.data != null){
        navlogin.innerHTML=""
        navlogin.textContent="登出"
        navlogin.setAttribute("onclick","signoutBtn();")
        navlogin.style="cursor:pointer"
    }
});
function signinbtn(){
    let email = document.querySelector(".user-input-mail").value
    let password = document.querySelector(".user-input-password").value
    data = {
        "email":email,
        "password":password
    };
    fetch("/api/user/auth",{
        method: "PUT",
        body: JSON.stringify(data),
        headers:{
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        }  
    })
    .then(function(response){
        return response.json();
    })
    .then(function(res){
        let signintext = document.querySelector(".sign-in-alert")
        if (res.ok == true) {
            navlogin.innerHTML=""
            navlogin.textContent="登出"
            navlogin.setAttribute("onclick","signoutBtn();")
            navlogin.style="cursor:pointer"
            signin.style.display = "none"
            bodybackground.style.display="none"
            window.location.reload();
        };
        if (res.error == true) {
            signintext.textContent = "帳號或密碼錯誤"
        };          
    });
};
function signoutBtn(){
    fetch("/api/user/auth",{
        method:"DELETE",
    })
    .then(function(response){
        return response.json();
    })
    .then(function(result){
        console.log(result)
        if(result.ok == true){
            window.location.reload();
        }
    })
}