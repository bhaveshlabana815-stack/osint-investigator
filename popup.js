document.getElementById("scanBtn").addEventListener("click", async () => {

let [tab] = await chrome.tabs.query({
active: true,
currentWindow: true
});

let url = new URL(tab.url);
let domain = url.hostname;

document.getElementById("domain").textContent = domain;

/* DOMAIN → IP */

fetch(`https://dns.google/resolve?name=${domain}&type=A`)
.then(res => res.json())
.then(data => {

let ip = "Not Found";

if (data.Answer) {
ip = data.Answer[0].data;
}

document.getElementById("ip").textContent = ip;

/* IP → LOCATION + ISP */

if(ip !== "Not Found"){

fetch(`https://ipapi.co/${ip}/json/`)
.then(res => res.json())
.then(info => {

document.getElementById("location").textContent =
(info.city || "") + " " + (info.country_name || "");

document.getElementById("isp").textContent =
info.org || "Unknown";

});

}

});

/* PAGE SCAN */

chrome.tabs.sendMessage(tab.id, {action: "scan"}, function(res){

if(!res) return;

document.getElementById("emails").textContent =
res.emails.length ? res.emails.join(", ") : "None";

document.getElementById("tech").textContent =
res.tech.length ? res.tech.join(", ") : "Unknown";

});

});


/* SHODAN BUTTON */

document.getElementById("shodan").addEventListener("click", async () => {

let [tab] = await chrome.tabs.query({
active:true,
currentWindow:true
});

let domain = new URL(tab.url).hostname;

chrome.tabs.create({
url: `https://www.shodan.io/search?query=${domain}`
});

});


/* VIRUSTOTAL BUTTON */

document.getElementById("vt").addEventListener("click", async () => {

let [tab] = await chrome.tabs.query({
active:true,
currentWindow:true
});

let domain = new URL(tab.url).hostname;

chrome.tabs.create({
url: `https://www.virustotal.com/gui/domain/${domain}`
});

});