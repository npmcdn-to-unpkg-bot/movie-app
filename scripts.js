$(document).ready(function(){
	var $grid = '';
	var titles = [];
	var imgBaseURL;
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=d12bfdc8bddc77fe1e499841895aec15";
	var configURL = baseURL + 'configuration' + apiKey;
	var nowPlaying = baseURL + 'movie/now_playing' + apiKey;

	// get a base URL for poster images
	$.getJSON(configURL, function(configData) {
		imgBaseURL = configData.images.base_url;
	});

	// get a list of genres from movie genre list endpoint
	var genres = [];
	var genreURL = baseURL + 'genre/movie/list' + apiKey;
	$.getJSON(genreURL, function(genreData) {
		var newHTML = '';
		$(genreData.genres).each(function(){
			// make a filter button for each genre name
			var genreID = this.id;
			var genreName = this.name;
			newHTML += '<input id="' + genreName.toLowerCase() + '-filter" type="button" class="btn btn-default genre-btn" value="' + genreName + '">';
			// add genre names and IDs to an array for correlation purposes later
			genres[genreID] = genreName;
		});
		$('#genre-filters').html(newHTML);
	});

	// start off with a set of now playing movies until search is used
	$.getJSON(nowPlaying, function(movieData) {
		var newHTML = '';
		$(movieData.results).each(function(){
			var currentPoster = imgBaseURL + 'w300' + this.poster_path;
			titles.push(this.title);
			newHTML += '<div class="poster now-playing ';
			// add genre classes to each poster
			for (i=0; i<this.genre_ids.length; i++) {
				var currID = this.genre_ids[i];
				newHTML += genres[currID] + ' ';
			}
			newHTML += 'col-sm-3"><img src="' + currentPoster + '">' + '</div>';
		});

		$('#poster-grid').html(newHTML);

		// initialize typeahead and isotope once we have some movies to work with
		getTypeahead();
		getIsotope();

		// add event listener on genre buttons
		$('.genre-btn').click(function() {
			// get rid of old filters
			$grid.isotope({ filter: '*' });
			// tell isotope that the posters may have changed since it was last loaded
			$grid.isotope('reloadItems')
			// then apply the filter
			var thisGenre = $(this).val();
			$grid.isotope({ filter: '.' + thisGenre })
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

	/* $('#comedy-filter').click(function(){
		$('#poster-grid').isotope({ filter: '.genre35' })
	}); */

	// pull up a specific movie poster upon clicking the search button;
	// you could also run all of this stuff when the search option changes;
	// use $('#search-by').change(function()...)
	$('#search-form').submit(function(){
		// first get the search option (movie/tv/person) from select element
		var searchOption = $('#search-by option:selected').val();
		var newTitles = [];
		var searchTitle = $('#search-str').val();
		var titleURL = baseURL + 'search/' + searchOption + apiKey + '&query=' + encodeURI(searchTitle) + '&page=1';
		newHTML = '';

		$.getJSON(titleURL, function(titleData){
			$(titleData.results).each(function(){
				if (searchOption == 'person') {
					$('#info').html("Persons of Interest");
					newTitles.push(this.name);
					newHTML += "<div class='poster person-profile col-sm-3'><img src=" + imgBaseURL + "w300" + this.profile_path + "'></div>";
				} else if (searchOption == 'tv') {
					$('#info').html("TV Shows");
					newTitles.push(this.name);
					newHTML += "<div class='poster tv-poster col-sm-3'><img src=" + imgBaseURL + "w300" + this.poster_path + "'></div>";
				}
				else {
					$('#info').html("Movies");
					newTitles.push(this.title);
					newHTML += "<div class='poster movie-poster ";
					for (i=0; i<this.genre_ids.length; i++) {
						var currID = this.genre_ids[i];
						newHTML += genres[currID] + ' ';
					}
					newHTML += "col-sm-3'><img src=" + imgBaseURL + "w300" + this.poster_path + "'></div>";
				}
			});
			$('#poster-grid').html(newHTML);
		});

		// kill the old typeahead instance because it has 'now playing' titles
		$('.typeahead').typeahead('destroy');
		// initialize typeahead again with the new titles
		$('.typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
		  name: 'newTitles',
		  source: substringMatcher(newTitles)
		});
	
		// prevent page from reloading on return or enter
		event.preventDefault();
	});

	function getIsotope() {
		$grid = $('#poster-grid').isotope({
			itemSelector: '.poster',
			layoutMode: 'masonry'
		});
		// layout Isotope after each image loads
		$grid.imagesLoaded().progress( function() {
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

	function getTypeahead() {
		$('.typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 2
		},
		{
		  name: 'titles',
		  source: substringMatcher(titles)
		});
	}

});