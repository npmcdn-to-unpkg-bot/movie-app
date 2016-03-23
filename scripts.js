$(document).ready(function(){
	// variables for moviedb stuff
	var titles = [];
	var imgBaseURL;
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=d12bfdc8bddc77fe1e499841895aec15";
	var configURL = baseURL + 'configuration' + apiKey;
	var nowPlaying = baseURL + 'movie/now_playing' + apiKey;
	var allTitles = [];
	//var searchAllURL = baseURL + "search/movie" + apiKey + "&query=" + "&page=1";
	var searchAllURL = baseURL + "movie/id" + apiKey;

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
	console.log(searchAllURL);
	$.getJSON(searchAllURL, function(allData) {
		$(allData.results).each(function(){
			allTitles.push(this.title);
		});
	});

	// pull up a specific movie poster upon clicking the search button
	$("#search").submit(function(){
		var searchTitle = $("#search-str").val();
		console.log(searchTitle);
		var movieSearchURL = baseURL + "search/movie" + apiKey + "&query=" + encodeURI(searchTitle) + "&page=1";
		newHTML = '';
		$.getJSON(movieSearchURL, function(movieData){
			var movieImage = movieData.results;
			$(movieData.results).each(function(){
				newHTML += "<div class=' movie-poster col-sm-3'><img src=" + imgBaseURL + "w300" + this.poster_path + "'></div>";
			});
			$("#poster-grid").html(newHTML);
		});
		event.preventDefault();
	});
});