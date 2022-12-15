var Atfirst = true;
var mode = true;
var currentId;
var qid = 0;
var btn = document.getElementById("btn");
var sub = document.getElementById("sub");
var ques = document.getElementById("ques");
var qholder = document.getElementById("qholder")
var qarea = document.getElementById("qarea");
var resarea = document.getElementById("resarea");
var sh = document.getElementById("sh");
var qh = document.getElementById("qh");
var sbtn = document.getElementById("sbtn");
var sname = document.getElementById("sname");
var scomment = document.getElementById("scomment");
var responseContainer = document.getElementById("responseContainer");
var rslbtn = document.getElementById("rslbtn");
var hide = document.getElementById("hide");
var store = false;
var keysInLs = Object.keys(localStorage);
console.log(keysInLs);
function loadPreviousData(){
    keysInLs.forEach((keys)=>{
        var ob = localStorage.getItem(keys);
        var rob = JSON.parse(ob);
        var s = rob.subject;
        var q = rob.question;
        createQuestion(s,q);
    })
    store = true;
}
loadPreviousData();
btn.addEventListener('click',()=>{
    var subject = sub.value;
    var question = ques.value;
    createQuestion(subject,question);
    sub.value = "";
    ques.value = "";
})
function createQuestion(subject,question){
    var x = String(qid);
    var d = document.createElement("div");
    d.setAttribute('class','questions');
    d.setAttribute('id','q'+qid);
    d.setAttribute('onclick','handleResponse(sid'+qid+',qid'+qid+')');
    var h2 = document.createElement("h2");
    h2.textContent = subject;
    h2.setAttribute("id","sid"+qid);
    h2.setAttribute("class","onlyq")
    var p = document.createElement("p");
    p.setAttribute("id","qid"+qid)
    p.textContent = question;
    d.appendChild(h2);
    d.appendChild(p);
    qholder.appendChild(d);
    if(store){
    storeTheData(subject,question)
    }
    qid++;
}
function storeTheData(subject,question){
    qinfo = {};
    qinfo.id = qid;
    qinfo.subject = subject;
    qinfo.question = question;
    qinfo.responses = [];
    var val = JSON.stringify(qinfo);
    localStorage.setItem("item"+qid,val);
}
function disappear(){
    qarea.setAttribute('style',"display:none;");
    resarea.setAttribute('style',"display:block");
}
function back(){
    qarea.setAttribute('style',"display:block;");
    resarea.setAttribute('style',"display:none");
}
function handleResponse(sid,qid){
    responseContainer.innerHTML = "";
    if(mode){
        disappear();
        var s = sid.textContent;
        var q = qid.textContent;
        sh.textContent = s;
        qh.textContent = q;
        console.log(s + " " + q);
        currentId = ReturnId(s);
        console.log(currentId);
    }
    var ob  = localStorage.getItem('item'+currentId);
    console.log(ob);
    var sob = JSON.parse(ob);
    var arr = sob.responses;
    for(let i = 0 ; i < arr.length ; i++){
        createResponse(arr[i].name,arr[i].comment,arr[i].uvote,arr[i].dvote,i);
    }
}
sbtn.addEventListener('click',()=>{
    console.log("Working");
    var name = sname.value;
    var comment = scomment.value;
    saveResponse(name,comment,0,0);
    mode = false;
    handleResponse();
    mode = true;
    // createResponse(name,comment,0,0);
    sname.value = "";
    scomment.value = "";
})
function createResponse(name,comment,like,dislike,i){
    var di = document.createElement("div");
    di.setAttribute("class","rqcontainer");
    di.setAttribute("style","border-bottom :1px solid #ccd1cf")
    var h4 = document.createElement("h4");
    h4.textContent = name;
    var p = document.createElement("p");
    p.textContent = comment;
    var i1 = document.createElement("i");
    i1.setAttribute("class","fa-solid fa-thumbs-up");
    i1.setAttribute("style","font-size: 25px; margin-left: 5px;")
    i1.setAttribute("onclick","upvote("+i+",il"+currentId+""+i+")");
    s1 = document.createElement("span");
    s1.textContent = like;
    s1.setAttribute("id","il"+currentId+''+i);
    var i2 = document.createElement("i");
    i2.setAttribute("style","font-size: 25px; margin-left: 5px;")
    i2.setAttribute("class","fa-solid fa-thumbs-down");
    i2.setAttribute("onclick","downvote("+i+",id"+currentId+""+i+")");
    s2 = document.createElement("span");
    s2.textContent = dislike;
    s2.setAttribute("id","id"+currentId+''+i);
    di.appendChild(h4);
    di.appendChild(p);
    di.appendChild(i1);
    di.appendChild(s1);
    di.appendChild(i2);
    di.appendChild(s2);
    responseContainer.appendChild(di);
}

function ReturnId(s){
    var id;
    var keysInLsf = Object.keys(localStorage);
    keysInLsf.forEach((keys)=>{
        var ob = localStorage.getItem(keys);
        var rob = JSON.parse(ob);
        if(rob.subject === s){
            id = rob.id;
        }
    })
    return id;
}
function saveResponse(name,comment,l,d){
    var res = {}
    res.name = name;
    res.comment = comment;
    res.uvote = l;
    res.dvote = d;
    var ob  = localStorage.getItem('item'+currentId);
    var sob = JSON.parse(ob);
    sob.responses.push(res);
    var jsob = JSON.stringify(sob);
    localStorage.setItem('item'+currentId,jsob);
    console.log("Saved")
}
rslbtn.addEventListener('click',()=>{
    localStorage.removeItem('item'+currentId);
    location.reload();
})
function SearchQuestions(){
    var counter = 0;
    hide.style.display = "none";
    var qusArray = document.getElementsByClassName("questions");
    var onlyq = document.getElementsByClassName("onlyq");
    var sbox = document.getElementById("searchinp");
    var text = sbox.value;
    var stext = text.toUpperCase();
    for(let i = 0 ; i < onlyq.length ; i++){
        var temp = onlyq[i].textContent;
        temp = temp.toUpperCase();
        if(temp.indexOf(stext) > -1){
            qusArray[i].style.display="";
        }else{
            qusArray[i].style.display="none";
            counter++;
        }
    }
    if(counter === qusArray.length){
        hide.style.display = "";
    }
    console.log(counter);
}
function upvote(i,id){
    var ob  = localStorage.getItem('item'+currentId);
    console.log(ob);
    console.log(i);
    var sob = JSON.parse(ob);
    var arr = sob.responses;
    console.log(arr[i]);
    var x = arr[i].uvote;
    arr[i].uvote = x+1;
    id.innerHTML = x+1;
    var nob = JSON.stringify(sob);
    console.log(nob);
    localStorage.setItem('item'+currentId,nob);
}
function downvote(i,id){
    var ob  = localStorage.getItem('item'+currentId);
    var sob = JSON.parse(ob);
    var arr = sob.responses;
    console.log(arr[i]);
    var x = arr[i].dvote;
    arr[i].dvote = x+1;
    id.innerHTML = x+1;
    var nob = JSON.stringify(sob);
    console.log(nob);
    localStorage.setItem('item'+currentId,nob);
}