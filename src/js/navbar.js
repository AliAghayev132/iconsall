(function () {
    const navbar = document.querySelector(".navbar");
    const btnOpen = document.getElementById("navbaropen");
    const btnClose = document.getElementById("navbarclose");
    btnOpen.addEventListener("click", () => {
        navbar.classList.add("navbar--open");

    })
    window.addEventListener("resize", () => {
        navbar.classList.remove("navbar--open");
    })
    btnClose.addEventListener("click", () => navbar.classList.remove("navbar--open"));
})();

export function closeNavbar() {
    navbar.classList.remove("navbar--open")
}
export function updateNavbar(par) {
    const buttons = document.querySelectorAll("[data-query]");
    for (let i = 0; i < buttons.length; ++i) {
        buttons[i].classList.remove("button--open");
    }
    document.querySelector(`[data-query=${par}]`).classList.add("button--open");
}