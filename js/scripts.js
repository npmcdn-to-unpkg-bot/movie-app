$(document).ready(function(){
	var $grid = '';
	var titles = [];
	var genres = [];
	//var movieGenres = [];
	//var tvGenres = [];
	var imgBaseURL;
	var baseURL = "https://api.themoviedb.org/3/";
	var configURL = baseURL + 'configuration' + apiKey;
	var nowPlaying = baseURL + 'movie/now_playing' + apiKey;

	// get a base URL for poster images
	$.getJSON(configURL, function(configData) {
		imgBaseURL = configData.images.base_url;
	});

	// get a list of movie genres from movie genre list endpoint
	var genreURL = baseURL + 'genre/movie/list' + apiKey;
	$.getJSON(genreURL, function(genreData) {
		var newHTML = '';
		$(genreData.genres).each(function(){
			// make a filter button for each genre name
			var genreID = this.id;
			var genreName = this.name;
			// remove spaces from genre names
			var safeGenreName = genreName.replace(/ /g, "");
			newHTML += '<input id="' + safeGenreName.toLowerCase() + '" type="button" class="btn btn-default genre-btn" value="' + genreName + '">';
			// add genre names and IDs to an array for correlation purposes later
			genres[genreID] = safeGenreName.toLowerCase();
		});
		$('#genre-filters').html(newHTML);
	});

	// start off with a set of now playing movies until search is used
	$.getJSON(nowPlaying, function(movieData) {
		var newHTML = '';
		$(movieData.results).each(function(){
			var currentPoster = imgBaseURL + 'w300' + this.poster_path;
			titles.push(this.title);
			newHTML += '<div data-toggle="modal" data-target="#modal" name="' + this.title + '" class="poster now-playing ';
			// loop through all genres associated with each movie
			for (i=0; i<this.genre_ids.length; i++) {
				var currID = this.genre_ids[i];
				newHTML += genres[currID] + ' ';
			}
			newHTML += 'col-sm-3"><img src="' + currentPoster + '">' + '</div>';
		});

		$('#poster-grid').html(newHTML);

		$('.poster').click(function(){
			var posterClickedName = $(this).attr('name');
			populateModal(posterClickedName);
		});

		// initialize typeahead and isotope once we have some movies to work with
		getTypeahead('titles', titles);
		getIsotope();

		// add event listener on genre buttons
		$('.genre-btn').click(function() {
			// get rid of old filters
			$grid.isotope({ filter: '*' });
			// tell isotope that the posters may have changed since it was last loaded
			$grid.isotope('reloadItems');
			// then apply the filter
			var thisGenre = $(this).attr('id');
			var thisGenreClass = '.' + thisGenre + '';
			console.log(thisGenreClass);
			$grid.isotope({ filter: thisGenreClass });
		});
	});

	// search all the movies via typeahead...
	// add event listener on keyup event that sends what you have typed into the AXAJ call
	/* $('#search-str').keyup(function(){
		var mySearchString = $('#search-str').val();
		var searchAllURL = baseURL + "search/keyword" + apiKey + "&query=" + mySearchString + "&page=1";
		console.log(searchAllURL);
		$.getJSON(searchAllURL, function(allData) {
			$(allData.results).each(function(){
				allTitles.push(this.title);
			});
		});
	}); */

	// pull up a specific movie poster upon clicking the search button;
	// you could also run all of this stuff when the search option changes using $('#search-by').change(function()...)
	$('#search-form').submit(function(){
		// first get the search option (movie/tv/person) from select element
		var searchOption = $('#search-by option:selected').val();
		console.log(searchOption);
		var newTitles = [];
		var searchTitle = $('#search-str').val();
		var titleURL = baseURL + 'search/' + searchOption + apiKey + '&query=' + encodeURI(searchTitle) + '&page=1';
		newHTML = '';

		$.getJSON(titleURL, function(titleData){
			$(titleData.results).each(function(){
				if (searchOption == 'person') {
					$('#info').html("Persons of Interest");
					newTitles.push(this.name);
					newHTML += '<div class="poster person-profile col-sm-3"><img src="' + imgBaseURL + 'w300' + this.profile_path + '"></div>';
				} else if (searchOption == 'tv') {
					$('#info').html("TV Shows");
					newTitles.push(this.name);
					newHTML += '<div data-toggle="modal" data-target="#modal" name="' + this.title + '" class="poster tv-poster ';
						for (i=0; i<this.genre_ids.length; i++) {
							var currID = this.genre_ids[i];
							newHTML += genres[currID] + ' ';
						}
					newHTML += 'col-sm-3"><img src="' + imgBaseURL + 'w300' + this.poster_path + '"></div>';
				} else if (searchOption == 'movie') {
					$('#info').html("Movies");
					newTitles.push(this.title);
					newHTML += '<div  data-toggle="modal" data-target="#modal" name="' + this.title + '" class="poster movie-poster ';
					for (i=0; i<this.genre_ids.length; i++) {
						var currID = this.genre_ids[i];
						newHTML += genres[currID] + ' ';
					}
					newHTML += 'col-sm-3"><img src="' + imgBaseURL + 'w300' + this.poster_path + '"></div>';
				} else {
					$('#info').html("Multi-search");
					if (this.media_type == 'person') {
						newTitles.push(this.name);
						newHTML += '<div class="poster person-profile col-sm-3"><img src="' + imgBaseURL + 'w300' + this.profile_path + '"></div>';
					} else if (this.media_type == 'tv') {
						newTitles.push(this.name);
						newHTML += '<div  data-toggle="modal" data-target="#modal" name="' + this.title + '" class="poster tv-poster ';
						for (i=0; i<this.genre_ids.length; i++) {
							var currID = this.genre_ids[i];
							newHTML += genres[currID] + ' ';
						}
						newHTML += 'col-sm-3"><img src="' + imgBaseURL + 'w300' + this.poster_path + '"></div>';
					} else {
						newTitles.push(this.title);
						newHTML += '<div data-toggle="modal" data-target="#modal" name="' + this.title + '" class="poster movie-poster ';
						for (i=0; i<this.genre_ids.length; i++) {
							var currID = this.genre_ids[i];
							newHTML += genres[currID] + ' ';
						}
						newHTML += 'col-sm-3"><img src="' + imgBaseURL + 'w300' + this.poster_path + '"></div>';
					}
				}
			});

			$('#poster-grid').html(newHTML);
			
			$('.poster').click(function(){
				var posterClickedName = $(this).attr('name');
				populateModal(posterClickedName);
			});
		});

		// kill the old typeahead instance because it has 'now playing' titles
		$('.typeahead').typeahead('destroy');
		// initialize typeahead again with the new titles
		getTypeahead('newTitles', newTitles);
		// prevent page from reloading on return or enter
		event.preventDefault();
	});

	function populateModal(posterClickedName){
		var titleURL = baseURL + 'search/multi' + apiKey + '&query=' + encodeURI(posterClickedName) + '&page=1';
		$.getJSON(titleURL, function(titleData){
			var overview = titleData.results[0].overview;
			var vote = titleData.results[0].vote_average;
			var mediaType = titleData.results[0].media_type;
			var genre_ids = titleData.results[0].genre_ids;
			var genreHTML = '';
			for (i=0; i<genre_ids.length; i++) {
				var currID = genre_ids[i];
				genreHTML += genres[currID] + ', ';
			}
			genreHTML = genreHTML.slice(0, -2);
			$('.modal-title').html(posterClickedName);
			$('.modal-body').html('<p>' + overview + '</p>' + '<p>Media type: ' + mediaType + '</p>'
				+ '<p>Genres: ' + genreHTML + '</p>' + '<p>Rating: ' + vote + '/10</p>');
		});
	}

	function getIsotope() {
		$grid = $('#poster-grid').isotope({
			itemSelector: '.poster',
			layoutMode: 'fitRows'
		});
		// layout Isotope after each image loads
		$grid.imagesLoaded().progress(function() {
			$grid.isotope('layout');
		});
	}

	// this is typeahead.js stuff
	var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
			var matches, substringRegex;
			// an array that will be populated with substring matches
			matches = [];
			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');
			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					matches.push(str);
				}
			});
			cb(matches);
		};
	};

	function getTypeahead(newName, titleArr) {
		$('.typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 2
		},
		{
		  name: newName,
		  source: substringMatcher(titleArr)
		});
	}

});
