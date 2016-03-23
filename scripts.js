$(document).ready(function(){
	// variables for moviedb stuff
	var titles = [];
	var imgBaseURL;
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=d12bfdc8bddc77fe1e499841895aec15";
	var configURL = baseURL + 'configuration' + apiKey;
	var nowPlaying = baseURL + 'movie/now_playing' + apiKey;
	var searchAll = baseURL + 'search/movie' + apiKey;

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
	  name: 'titles',
	  source: substringMatcher(titles)
	});

	// this is the moviedb stuff

	/* function Movie(title, releaseDate, poster, popularity) {
		this.title = title;
		this.releaseDate = releaseDate;
		this.poster = poster;
		this.popularity = popularity;
	} */

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

	// I want to search all the movies here.
	/* 
	$.getJSON(searchAll, function(allData) {
		console.log(allData);
		for (i=0; i<movieDataAll.results.length; i++) {
			// var currentPoster = imgBaseURL + 'w300' + movieData.results[i].poster_path;
			allTitles.push(movieData.results[i].title);
		} 
	});
	
 
	function getNewReults() {
		var searchMovies = baseURL + 'search/movie' + apiKey + '?query' + myTitle;
		$.getJSON(searchMovies, function(movieData) {
		titles = [];
		newHTML = [];
		for (i=0; i<movieData.results.length; i++) {
			var currentPoster = imgBaseURL + 'w300' + movieData.results[i].poster_path;
			titles.push(movieData.results[i].title);
			newHTML += '<div class="col-sm-3">';
			newHTML += '<img src="' + currentPoster + '">';
			newHTML += '</div>';
		}
		$('#poster-grid').html(newHTML);
		});
	} */

	var myTitle = '';
	$('#search').submit(function(){
		myTitle = $('#search-str').val();
		console.log(myTitle);
		event.preventDefault();
	});
});