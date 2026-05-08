chrome.runtime.onMessage.addListener((req,sender,sendResponse)=>{

if(req.action==="scan"){

let text=document.body.innerText || "";

let emailRegex=/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig;

let emails=text.match(emailRegex)||[];

let tech=[];

if(document.querySelector('script[src*="jquery"]'))
tech.push("jQuery");

if(document.querySelector('script[src*="react"]'))
tech.push("React");

if(document.querySelector('script[src*="angular"]'))
tech.push("Angular");

if(document.querySelector('meta[name="generator"]'))
tech.push("CMS");

sendResponse({

emails:[...new Set(emails)],
tech:tech

});

}

return true;

});