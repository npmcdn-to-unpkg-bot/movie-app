$(document).ready(function(){
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "d12bfdc8bddc77fe1e499841895aec15";

	var nowPlaying = baseURL + 'movie/now_playing' + '?api_key=' + apiKey;
	$.getJSON(nowPlaying, function(movieData) {
		// bring bag movieData from moviedb and print it to the console
		var currResults = [];
		for (i=0; i<4; i++) {
			currResults[i] = movieData.results[i].title;
			var thisOne = '#poster' + (i+1);
			$(thisOne).html(currResults[i]);
		}
	});

});