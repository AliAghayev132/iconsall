import { updateNavbar, closeNavbar } from "./navbar.js";
const URL = "https://cdn.jsdelivr.net/gh/AliAghayev132/iconsall/src/css/icons";
const packageNames = {};
const downloadInput = document.getElementById("downloadinput");
const allSection = document.getElementById("all__section");
const navbar = document.getElementById("navbar");
const containerIcons = document.getElementById("icon-container");
const containerAllIcons = document.getElementById("icon-all-container");
const searchInput = document.getElementById("searchInput");

const allpackages = {};
let currentIcons = [];
let currentQuery = "";

function clearAllContainer() {
    containerAllIcons.innerHTML = "";
}

const showAllSection = () => allSection.classList.remove("d-none");
const hideAllSection = () => allSection.classList.add("d-none");

chooseQuery("bootstrap");
const clearContainer = () => containerIcons.innerHTML = ""
async function getIcons(par) {
    const response = await fetch("./db/" + par + ".json");
    return await response.json();
}

async function chooseQuery(par) {
    updateDownloadLink(par);
    goTop();
    if (par !== "all") {
        resetAllSection();
        resetPackages();
        if (currentQuery !== par) {
            hideAllSection();
            currentIcons = await getIcons(par);
            renderIcons(currentIcons);
        }
        clearAllContainer();
    } else {
        showAllSection();
        clearContainer();
    }
    currentQuery = par;
    closeNavbar();
    updateNavbar(par);
    search(searchInput.value);
}

function renderIcons(icons) {
    clearContainer();
    for (let i = 0; i < icons.length; ++i) renderIcon({ name: icons[i] });
}

function renderIcon(data) {
    const element = document.createElement("div");
    const icon = document.createElement("i");
    element.classList.add("icon");
    element.dataset.name = data.name;
    icon.setAttribute("class", data.name);
    element.appendChild(icon)
    containerIcons.appendChild(element);
}

function goTop() {
    window.scrollTo(0, 0);
}

//?  |||||||||| Events ||||||||||
navbar.addEventListener("click", function (e) {
    if (e.target.dataset.query)
        chooseQuery(e.target.dataset.query);
})

//? |||||||||| Search Event ||||||||||
searchInput.addEventListener("input", ({ target }) => {
    const value = target.value.toLowerCase();
    search(value);
})

function search(value) {
    if (currentQuery !== "all") {
        const tempIcons = [];
        for (let i = 0; i < currentIcons.length; ++i) {
            if (currentIcons[i].includes(value))
                tempIcons.push(currentIcons[i]);
        }
        renderIcons(tempIcons);
    } else {
        if (value.length >= 3) {
            updateIconsAll(value);
        }
    }
}

//? |||||||||| Scroll Event ||||||||||
document.addEventListener("scroll", () => {
    goTopButton.classList[window.scrollY > 100 ? "remove" : "add"]("opacity-0");
})

const goTopButton = document.querySelector(".go-top-button");
goTopButton.addEventListener("click", goTop);

(async function () {
    const response = await fetch("../../icons.json")
    const data = await response.json();
    for (let i = 0; i < data.length; ++i) {
        packageNames[data[i].key] = data[i].title;
        allpackages[data[i].key] = { data: null, rendered: false };
        allSection.firstElementChild.innerHTML +=
            `
            <div class="form-check d-flex align-items-center gap-1">
                <input class="form-check-input" type="checkbox" value=${data[i].key}>
                <label class="form-check-label" for="">
                ${data[i].title}
                </label>
            </div>
            `
    }
})();

allSection.addEventListener("change", async function (e) {
    const target = e.target;
    const value = target.value;
    const packageData = allpackages[value];
    const query = searchInput.value;

    if (target.checked) {
        packageData.rendered = true;
        if (!packageData.data) {
            await fetchData(value);
        }
        renderIconsAll(value, query);
    } else {
        packageData.rendered = false;
        deleteIconsAll(value);
    }
})

async function fetchData(par) {
    const response = await fetch(`../../db/${par}.json`);
    const data = await response.json();
    allpackages[par].data = data;
}

function resetPackages() {
    for (let i in allpackages)
        allpackages[i] = { data: null, rendered: false };
}

function renderIconsAll(par, query) {
    const container = document.createElement("div");
    container.setAttribute("id", `${par}--container`);

    const title = document.createElement("div");
    title.innerHTML =
        `
        <div class = "title__underline max-800">
            <h2 class = "package__title">
                ${packageNames[par]}
            </h2>
            <button data-role="copy-btn" type = "button" value = ${URL}/${par}.css class = "btn btn-outline-success">
                <span class ="me-1">
                    CDN
                </span>
                <i class = "icofont-copy-invert"></i>
            </button>
        </div>
    `


    container.appendChild(title);

    const iconsContainer = document.createElement("div");
    iconsContainer.classList.add("container__icons");
    const icons = allpackages[par].data;

    for (let i = 0; i < icons.length; ++i) {
        if (icons[i].includes(query)) {
            const element = document.createElement("div");
            const icon = document.createElement("i");
            icon.setAttribute("class", icons[i]);
            element.classList.add("icon");
            element.dataset.name = icons[i];
            element.appendChild(icon)
            iconsContainer.appendChild(element);
        }
    }
    if (iconsContainer.children.length === 0)
        container.innerHTML += `<h2 class = "display-6 text-center max-800 mx-auto" >Not Found</h2>`

    container.appendChild(iconsContainer)
    containerAllIcons.appendChild(container);
}

function deleteIconsAll(par) {
    document.getElementById(`${par}--container`).remove();
    allpackages[par].rendered = false;
}

function updateIconsAll(query) {
    containerAllIcons.innerHTML = "";
    for (let i in allpackages) {
        if (allpackages[i].rendered)
            renderIconsAll(i, query);
    }
}

function resetAllSection() {
    const children = allSection.querySelectorAll("input");
    for (let i = 0; i < children.length; ++i) {
        children[i].checked = false;
    }
}

function updateDownloadLink(link) {
    downloadInput.value = `${URL}/${link}.css`;
    downloadInput.previousElementSibling.innerHTML = "CDN Link"
}

let timeout = null;
downloadInput.addEventListener("click", function () {
    const url = this.value;
    const element = this.previousElementSibling;
    navigator.clipboard.writeText(`<link rel="stylesheet" href="${url}">`)
    if (timeout) {
        clearTimeout(timeout);
        timeout = null
    }
    element.innerHTML = `CDN Link <span class = "badge p-1 bg-success">Copied <i class = "fa-solid fa-copy"></i></i></span>`
    timeout = setTimeout(() => element.innerHTML = "CDN Link", 3000);
})

document.addEventListener("click", ({ target }) => {
    {
        const role = target.dataset.role;
        let timeout = null;
        switch (role) {
            case "copy-btn":
                navigator.clipboard.writeText(`<link rel="stylesheet" href="${target.value}">`);
                target.innerHTML = `
            <span class ="me-1">
                Copied
            </span>
            <i class = "fa-solid fa-check"></i>
            `
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                timeout = setTimeout(() => {
                    target.innerHTML = `
                    <span class ="me-1">
                        CDN
                    </span>
                    <i class = "icofont-copy-invert"></i>
                `
                }, 3000);
                return;
        }
    }
    {
        let timeout = null;
        if (target.classList.contains("icon")) {
            navigator.clipboard.writeText(`<i class = "${target.dataset.name}"></i>`);
            target.innerHTML += `<div class = "icon--copy">Copied</div>`
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            timeout = setTimeout(() => target.querySelector(".icon--copy").remove(), 2000);
        }
    }
})
