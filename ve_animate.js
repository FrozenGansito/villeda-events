document.addEventListener("DOMContentLoaded", function () {
    var selector = [
        ".section-header:not(.product-section-title):not(.pinata-section-title):not(.home-what-header)",
        ".stagger:not(.product-grid):not(.home-features) > *",
        ".info-card",
        ".pricing-list",
        ".carousel-wrap",
        ".gallery-img:not(:nth-child(-n+6))",
        ".content-block:not(.pinata-intro)",
        ".section-note",
        ".contact-section > p",
        ".contact-section > a",
        ".review-section > img",
        ".review-section > a",
        ".pricing-section > p"
    ].join(", ");

    var targets = document.querySelectorAll(selector);

    if (!("IntersectionObserver" in window)) {
        targets.forEach(function (el) { el.classList.add("reveal", "is-visible"); });
        return;
    }

    targets.forEach(function (el) {
        el.classList.add("reveal");
    });

    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

            targets.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                var inViewport = rect.top < window.innerHeight && rect.bottom > 0;
                if (inViewport) {
                    el.style.transition = "none";
                    el.classList.add("is-visible");
                    el.getBoundingClientRect();
                    el.style.transition = "";
                } else {
                    observer.observe(el);
                }
            });
        });
    });
});
