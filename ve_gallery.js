
"use strict";

const tabs = document.querySelectorAll('.tab');
const images = document.querySelectorAll('.gallery-img');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        images.forEach(img => {
            if (filter === 'all' || img.classList.contains(filter)) {
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        });
    });
});


const dialog = document.getElementById('lightbox');
const dialogImg = document.getElementById('lightbox-img');

function openLightbox(img) {
    dialogImg.src = img.src;
    dialog.showModal();
}

function closeLightbox() {
    dialog.close();
}

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
        dialog.close();
    }
});