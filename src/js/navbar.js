export default function controlNavbar() {
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
}