import fs from 'fs';

function formatDate(rawMins) {
    const hours = Math.floor(rawMins / 60);
    const mins = rawMins - hours * 60;

    return `${hours}h ${mins}m`;
}

const template = fs.readFileSync('./template.html', 'utf8');
const data = JSON.parse(fs.readFileSync('../data/movies.json', 'utf8'));

const uniqId = new Set();

const preparedData = data.filter(item => {
    if (uniqId.has(item.id)) {
        console.log('non uniq id', item.id);
        return false;
    }

    uniqId.add(item.id);

    return true;
});

const content = preparedData.map(item => {
    const ageContent = item.age === undefined ?
    '' :
    `<div class="movie-card__info-item movie-card__age">${item.age}+</div>`;

    return `
    <div class="movie-card" id="id${item.id}">
    <div class="movie-card__title">
        <div class="movie-card__title-en">${item.title}</div>
        <div class="movie-card__title-ru">${item.title_ru}</div>
    </div>
    <div class="movie-card__info">
        <div class="movie-card__info-item movie-card__year">${item.year}</div>
        <div class="movie-card__info-item movie-card__duration">${formatDate(item.duration)}</div>
        ${ageContent}
        <div class="movie-card__info-item movie-card__country">${item.country.join(', ')}</div>
        <div class="movie-card__info-item movie-card__genre">${item.genre.join(', ')}</div>
        <a target="_blank" href="https://www.imdb.com/find?q=${encodeURIComponent(item.title)}" class="movie-card__info-item movie-card__imdb">IMDb: ${item.imdb}</a>
    </div>
    <div class="movie-card__timelines">
        <div class="movie-card__average-timeline" title="Average color">
            <img loading="lazy" class="movie-card__average-timeline-image" src="./images/average/${item.id}.png" />
        </div>
        <div class="movie-card__dominant-timeline" title="Dominant color">
            <img loading="lazy" class="movie-card__average-timeline-image" src="./images/dominant/${item.id}.png" />
        </div>
    </div>
</div>
`;
});


let result = template
    .replace(/\{NOW\}/g, Date.now())
    .replace(/\{CONTENT\}/, content.join('\n'));

fs.writeFileSync('../index.html', result, { encoding: 'utf-8'});
fs.writeFileSync('../static/data.js', 'var moviesData = ' + JSON.stringify(preparedData, null, '  '), { encoding: 'utf-8'})
