document.getElementById("scan").addEventListener("click", scanWebsite);

function scanWebsite(){

chrome.tabs.query({active:true,currentWindow:true}, async function(tabs){

let url = new URL(tabs[0].url);
let domain = url.hostname.replace("www.","");

document.getElementById("domain").innerText = domain;

getIP(domain);
getSubdomains(domain);
getDNS(domain);

});

}

async function getIP(domain){

try{

let res = await fetch("https://dns.google/resolve?name="+domain+"&type=A");
let data = await res.json();

let ip = data.Answer[0].data;

document.getElementById("ip").innerText = ip;

let ipinfo = await fetch("http://ip-api.com/json/"+ip);
let ipdata = await ipinfo.json();

document.getElementById("isp").innerText = ipdata.isp;
document.getElementById("org").innerText = ipdata.org;
document.getElementById("country").innerText = ipdata.country;

}catch{

document.getElementById("ip").innerText="Not Found";

}

}

async function getSubdomains(domain){

let found = new Set();

try{

// crt.sh source
let crt = await fetch("https://crt.sh/?q=%25."+domain+"&output=json");
let crtdata = await crt.json();

crtdata.forEach(item=>{

let names = item.name_value.split("\n");

names.forEach(n=>{
if(n.includes(domain)){
found.add(n.trim());
}
});

});

}catch{}

try{

// hackertarget source
let ht = await fetch("https://api.hackertarget.com/hostsearch/?q="+domain);
let text = await ht.text();

text.split("\n").forEach(line=>{

let parts = line.split(",");

if(parts[0].includes(domain)){
found.add(parts[0]);
}

});

}catch{}

let list = Array.from(found).slice(0,30).join("\n");

if(list.length === 0){
list = "No subdomains found";
}

document.getElementById("subdomains").innerText = list;

}

async function getDNS(domain){

try{

let res = await fetch("https://dns.google/resolve?name="+domain);
let data = await res.json();

let records = "";

if(data.Answer){

data.Answer.forEach(r=>{

records += r.type + " : " + r.data + "\n";

});

}

document.getElementById("dns").innerText = records;

}catch{

document.getElementById("dns").innerText="Not Found";

}

}

document.getElementById("shodan").addEventListener("click", function(){

let domain = document.getElementById("domain").innerText;

window.open("https://www.shodan.io/search?query="+domain);

});

document.getElementById("virustotal").addEventListener("click", function(){

let domain = document.getElementById("domain").innerText;

window.open("https://www.virustotal.com/gui/domain/"+domain);

});

document.getElementById("nmap").addEventListener("click", function(){

let domain = document.getElementById("domain").innerText;

window.open("https://hackertarget.com/nmap-online-port-scanner/?q="+domain);

});