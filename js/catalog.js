const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var siteTitle = document.getElementsByClassName("catalog-title")[0];
siteTitle.innerHTML = urlParams.get("c");