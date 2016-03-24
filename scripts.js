$(document).ready(function(){
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

	// add an initial set of 'now playing' movies to the poster grid
	
	$.getJSON(nowPlaying, function(movieData) {
		var newHTML = '';
		$(movieData.results).each(function(){
			var currentPoster = imgBaseURL + 'w300' + this.poster_path;
			titles.push(this.title);
			newHTML += '<div class="col-sm-3"><img src="' + currentPoster + '">' + '</div>';
		});
		$('#poster-grid').html(newHTML);
	});

	// search all the movies via typeahead...
	// add event listener on keyup event that sends what you have typed into the AXAJ call
	/* var searchAllURL = baseURL + "search/keyword" + apiKey + "&query=" + "&page=1";
	console.log(searchAllURL);
	$.getJSON(searchAllURL, function(allData) {
		$(allData.results).each(function(){
			allTitles.push(this.title);
		});
	}); */

	// pull up a specific movie poster upon clicking the search button
	$('#search').submit(function(){
		// first get the search option (movie/tv/person) from select element
		var searchOption = $('#search-by option:selected').val();
		var newTitles = [];
		var searchTitle = $('#search-str').val();
		var titleURL = baseURL + 'search/' + searchOption + apiKey + '&query=' + encodeURI(searchTitle) + '&page=1';
		newHTML = '';

		$.getJSON(titleURL, function(titleData){
			$(titleData.results).each(function(){
				if (searchOption == 'person') {
					newTitles.push(this.name);
					newHTML += "<div class='movie-poster col-sm-3'><img src=" + imgBaseURL + "w300" + this.profile_path + "'></div>";
				} else if (searchOption == 'tv') {
					newTitles.push(this.name);
					newHTML += "<div class='movie-poster col-sm-3'><img src=" + imgBaseURL + "w300" + this.poster_path + "'></div>";
				} else {
					newTitles.push(this.title);
					newHTML += "<div class='movie-poster col-sm-3'><img src=" + imgBaseURL + "w300" + this.poster_path + "'></div>";
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

		event.preventDefault();
	});

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

	// initialize typeahead
	$('.typeahead').typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1
	},
	{
	  name: 'titles',
	  source: substringMatcher(titles)
	});

});