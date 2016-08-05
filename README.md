# Movie Crawler

Using AJAX (jQuery's $.getJSON method), this web page pulls data from themoviedb.org and displays a list of "Now Playing" movies. From there, the user may search movies by movie title, TV show title, or person (actor/director/etc.), and the poster images change to reflect the search query. Typeahead.js is used to display partial search matches for each set of displayed posters. Isotope with imagesLoaded is used to filter titles by genre. When a poster image is clicked, a modal window opens showing more information about the movie/show.

[demo here](http://www.kdavidmoore.com/movie-crawler)

![PNG](http://i67.tinypic.com/148g2he.png)

## Built with
* jQuery
* Bootstrap (for modals)
* Isotope
* Typeahead.js

See [themoviedb.org](http://docs.themoviedb.apiary.io/) for API information.

[I learned this at DigitalCrafts](https://www.digitalcrafts.com)
