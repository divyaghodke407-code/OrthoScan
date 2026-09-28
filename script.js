const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        // आधीच्या active link मधून class काढा
        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        // ज्या link वर click केलं त्याला active करा
        this.classList.add("active");
    });
});