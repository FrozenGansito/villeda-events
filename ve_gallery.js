document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const images = document.querySelectorAll(".gallery-img");

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t) { t.classList.remove("active"); });
            tab.classList.add("active");

            const filter = tab.getAttribute("data-filter");

            images.forEach(function (img) {
                if (filter === "all" || img.classList.contains(filter)) {
                    img.style.display = "";
                } else {
                    img.style.display = "none";
                }
            });
        });
    });

    const lightboxDialog = document.getElementById("lightbox");

    lightboxDialog.addEventListener("click", function (e) {
        if (e.target === lightboxDialog) {
            closeLightbox();
        }
    });

    const lightboxImg = document.getElementById("lightbox-img");
    let touchStartX = null;

    lightboxImg.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightboxImg.addEventListener("touchend", function (e) {
        if (touchStartX === null) return;
        const deltaX = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(deltaX) > 40) {
            navigateLightbox(deltaX < 0 ? 1 : -1);
        }
        touchStartX = null;
    });
});

let lightboxImages = [];
let lightboxIndex = 0;

function updateLightboxCounter() {
    const currentEl = document.getElementById("lightbox-counter-current");
    const totalEl = document.getElementById("lightbox-counter-total");
    if (!currentEl || !totalEl) return;
    currentEl.textContent = lightboxIndex + 1;
    totalEl.textContent = lightboxImages.length;
}

function openLightbox(img) {
    const container = img.closest(".gallery-grid, .carousel-track") || img.parentElement;
    lightboxImages = Array.from(container.querySelectorAll(".gallery-img, .carousel-img")).filter(function (el) {
        return el.offsetParent !== null;
    });
    lightboxIndex = lightboxImages.indexOf(img);

    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.style.transition = "none";
    lightboxImg.style.transform = "translateX(0)";
    lightboxImg.style.opacity = "1";
    lightboxImg.src = img.src;
    updateLightboxCounter();
    document.getElementById("lightbox").showModal();
}

let lightboxAnimating = false;

function navigateLightbox(direction) {
    if (!lightboxImages.length || lightboxAnimating) return;
    lightboxAnimating = true;

    const img = document.getElementById("lightbox-img");
    img.style.transition = "transform 0.25s ease, opacity 0.25s ease";
    img.style.transform = "translateX(" + (direction * -40) + "px)";
    img.style.opacity = "0";

    setTimeout(function () {
        lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
        img.src = lightboxImages[lightboxIndex].src;
        updateLightboxCounter();

        img.style.transition = "none";
        img.style.transform = "translateX(" + (direction * 40) + "px)";

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                img.style.transition = "transform 0.25s ease, opacity 0.25s ease";
                img.style.transform = "translateX(0)";
                img.style.opacity = "1";
                setTimeout(function () { lightboxAnimating = false; }, 250);
            });
        });
    }, 250);
}

function closeLightbox() {
    document.getElementById("lightbox").close();
}

function scrollCarousel(btn, direction) {
    var track = btn.parentElement.querySelector(".carousel-track");
    var slides = track.querySelectorAll(".carousel-img");
    if (!slides.length) return;
    var step = slides[0].getBoundingClientRect().width || track.clientWidth;
    var index = step ? Math.round(track.scrollLeft / step) : 0;

    if (direction > 0 && index >= slides.length - 1) {
        track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && index <= 0) {
        track.scrollTo({ left: step * (slides.length - 1), behavior: "smooth" });
    } else {
        track.scrollBy({ left: direction * step, behavior: "smooth" });
    }
}

document.querySelectorAll(".carousel-track").forEach(function (track) {
    var wrap = track.closest(".carousel-wrap");
    var counter = wrap ? wrap.querySelector(".carousel-counter") : null;
    if (!counter) return;

    var currentEl = counter.querySelector(".carousel-counter-current");
    var totalEl = counter.querySelector(".carousel-counter-total");
    var slides = track.querySelectorAll(".carousel-img");
    totalEl.textContent = slides.length;

    var updateCounter = function () {
        var step = slides[0] ? slides[0].getBoundingClientRect().width : track.clientWidth;
        var index = step ? Math.round(track.scrollLeft / step) : 0;
        index = Math.max(0, Math.min(index, slides.length - 1));
        currentEl.textContent = index + 1;
    };

    track.addEventListener("scroll", function () {
        clearTimeout(track._counterTimeout);
        track._counterTimeout = setTimeout(updateCounter, 100);
    });
});
