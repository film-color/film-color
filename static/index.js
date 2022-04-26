(function() {
    const searchInput = document.querySelector('.search__input');
    const movieCard = document.querySelectorAll('.movie-card');
    const cards = Array.from(movieCard);

    searchInput.oninput = function() {
        const value = searchInput.value.toLowerCase().trim();

        if (!value) {
            cards.forEach(function(item) {
                item.style.display = '';
            });
        }

        cards.forEach(function(item, i) {
            const visible = moviesData[i].title.toLowerCase().indexOf(value) !== -1 ||
                moviesData[i].title_ru.toLowerCase().indexOf(value) !== -1;
            item.style.display = visible ? '' : 'none';
        });
    };
})();