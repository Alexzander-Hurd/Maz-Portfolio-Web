document.querySelectorAll('.art-piece').forEach((artpiece) => {
    artpiece.addEventListener('click', () => {
        artpiece.classList.toggle('active');
    })
});