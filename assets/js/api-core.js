(function () {

const LOCAL_API = "http://localhost:10000";
const PROD_API = "https://sn-design-api.onrender.com";

const isLocal =
location.hostname === "localhost" ||
location.hostname === "127.0.0.1";

window.API_BASE = isLocal ? LOCAL_API : PROD_API;

window.apiFetch = async function(endpoint, options = {}) {

try {

const url = window.API_BASE + endpoint;

console.log("API CALL:", url);

const res = await fetch(url, {
headers: {
"Content-Type": "application/json"
},
...options
});

if(!res.ok){
throw new Error("API ERROR: " + res.status);
}

return await res.json();

}catch(err){

console.error("API FAILED:", err);
throw err;

}

};

})();
