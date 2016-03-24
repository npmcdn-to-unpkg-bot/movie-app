$(document).ready(function(){
	// variables for moviedb stuff
	var titles = [];
	var imgBaseURL;
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=d12bfdc8bddc77fe1e499841895aec15";
	var configURL = baseURL + 'configuration' + apiKey;
	var nowPlaying = baseURL + 'movie/now_playing' + apiKey;
	var allTitles = [];

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

	// initialize typeahead nao
	$('.typeahead').typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1
	},
	{
	  name: 'allTitles',
	  source: substringMatcher(allTitles)
	});

	// this is the moviedb stuff
	// get a base URL for poster images
	$.getJSON(configURL, function(configData) {
		imgBaseURL = configData.images.base_url;
	});

	// add an initial set of 'now playing' movies to the poster grid
	
	$.getJSON(nowPlaying, function(movieData) {
		var newHTML = '';
		for (i=0; i<movieData.results.length; i++) {
			var currentPoster = imgBaseURL + 'w300' + movieData.results[i].poster_path;
			titles.push(movieData.results[i].title);
			newHTML += '<div class="col-sm-3">';
			newHTML += '<img src="' + currentPoster + '">';
			newHTML += '</div>';
		}
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
		// first get the search option from select element
		var searchOption = $('#search-by option:selected').val();

		if (searchOption == 'movie' || searchOption == 'tv') {
			var searchTitle = $('#search-str').val();
			var titleURL = baseURL + 'search/' + searchOption + apiKey + '&query=' + encodeURI(searchTitle) + '&page=1';
			newHTML = '';
			$.getJSON(titleURL, function(titleData){
				$(titleData.results).each(function(){
					newHTML += "<div class=' movie-poster col-sm-3'><img src=" + imgBaseURL + "w300" + this.poster_path + "'></div>";
				});
				$('#poster-grid').html(newHTML);
			});
		} else if (searchOption == 'person') {
			var searchPerson = $('#search-str').val();
			var personURL = baseURL + 'search/person' + apiKey + '&query=' + encodeURI(searchPerson) + '&page=1';
			newHTML = '';
			$.getJSON(personURL, function(personData){
				$(personData.results).each(function(){
					newHTML += "<div class=' movie-poster col-sm-3'><img src=" + imgBaseURL + "w300" + this.profile_path + "'></div>";
				});
				$('#poster-grid').html(newHTML);
			});
		}

		event.preventDefault();
	});

});