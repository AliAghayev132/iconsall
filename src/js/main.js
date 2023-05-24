const URL = "https://aliaghayev132.github.io/iconsall/src/css/icons";
const downloadInput = document.getElementById("downloadinput");

let query = "bootstrap";
updateLink(query);
const icons = {
    bootstrap: [],
    fontawesome: [],
    lineicons: [],
    icofont: [],
    all: [],
}
const btnUp = document.querySelector(".go-top-button");
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
    const temp = [];
    for (let i = 0; i < icons[query].length; ++i) {
        if (icons[query][i].toLowerCase().includes(searchInput.value.toLowerCase())) {
            temp.push(icons[query][i]);
        }
    }
    updateIcons(temp);
})

document.addEventListener("click", e => {
    if (e.target.classList.contains("icon")) {
        navigator.clipboard.writeText(e.target.dataset.name);
        e.target.innerHTML +=
            `        
            <div class="icon--copy">
                Copyed
            </div>
        `
        setTimeout(() => {
            e.target.querySelector(".icon--copy").remove();
        }, 2000);
    }
})

const nav = document.querySelector("nav");
const containerIcons = document.querySelector('.container__icons');
const queries = document.querySelectorAll("[data-query]");
const nextBtn = document.getElementById("nextbtn");
const pagination = new Pagination;

function Pagination() {
    this.currentPage = 1;
    this.iconsPerPage = 0;
    this.countOfIcons = 0;
    this.maxCountPage = 0;
    this.lastPage = () => this.currentPage === this.maxCountPage;
    this.data = null;
    this.reset = () => {
        this.currentPage = 1;
        this.iconsPerPage = 0;
        this.countOfIcons = 0;
        this.maxCountPage = 0;
    }
    this.set = ({ icons_per_page, data }) => {
        this.iconsPerPage = icons_per_page;
        this.countOfIcons = data.length;
        this.maxCountPage = Math.ceil(this.countOfIcons / this.iconsPerPage);
        this.data = data;
    }
    this.nextPage = () => {
        if (this.maxCountPage > this.currentPage) {
            return ++this.currentPage;
        } else {
            return false;
        }
    }
    this.getIconsPerPage = () => this.data.slice((this.currentPage - 1) * this.iconsPerPage, (this.currentPage) * this.iconsPerPage);
}
nav.addEventListener("click", async (e) => {
    if(e.target.dataset.query)
        document.querySelector(".navbar").classList.remove("navbar--open")

    if (e.target.dataset.query && !e.target.classList.contains("button--open")) {
        window.scroll(0, 0);
        searchInput.value = "";
        query = e.target.dataset.query;
        updateLink(query);
        if (query == "all") {
            if (icons.all.length == 0) {
                const iconPromises = [];
                for (const key in icons) {
                    if (key !== "all") {
                        if (icons[key].length > 0) {
                            icons.all = [...icons.all, ...icons[key]];
                        } else {
                            iconPromises.push(getIcons(key));
                        }
                    }
                }
                icons.all = [...icons.all, ...(await Promise.all(iconPromises)).flat()];
            }

            updateIcons(icons.all);
        }
        else {
            if (icons[query].length == 0) {
                icons[query] = await getIcons(query);
                updateIcons(icons[query]);
            } else {
                updateIcons(icons[query]);
            }
        }
        for (let i = 0; i < queries.length; ++i) queries[i].classList.remove("button--open");
        e.target.classList.add("button--open");
    }
})

icons.bootstrap = await getIcons("bootstrap");
updateIcons(icons.bootstrap);

function loadIcons(par) {
    for (let i = 0; i < par.length; ++i) {
        const div = document.createElement("div");
        div.dataset.name = par[i];
        div.classList.add("icon");
        const icon = document.createElement("i");
        icon.setAttribute("class", par[i]);
        div.appendChild(icon)
        containerIcons.appendChild(div)
    }
}

async function getIcons(par) {
    const response = await fetch(`./db/${par}.json`)

    return await response.json();
}

function updateIcons(data) {
    nextBtn.classList.remove("d-none");
    containerIcons.innerHTML = "";
    pagination.reset();
    pagination.set({
        icons_per_page: 96,
        data
    })
    if (pagination.lastPage())
        nextBtn.classList.add("d-none");

    if (pagination.countOfIcons == 0)
        nextBtn.classList.add("d-none");

    loadIcons(pagination.getIconsPerPage());
}

nextBtn.addEventListener("click", () => {
    if (pagination.nextPage()) {
        const icons = pagination.getIconsPerPage();
        loadIcons(icons);
        if (pagination.maxCountPage == pagination.currentPage)
            nextBtn.classList.add("d-none");
    }
})



document.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        btnUp.classList.remove("opacity-0");
    } else {
        btnUp.classList.add("opacity-0");
    }
})

btnUp.addEventListener("click", () => window.scroll(0, 0));

import controlNavbar from './navbar.js';
controlNavbar();


function updateLink(par){
    downloadInput.value = `${URL}/${par}/.css`;
}