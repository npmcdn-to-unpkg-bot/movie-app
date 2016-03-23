$(document).ready(function(){
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=d12bfdc8bddc77fe1e499841895aec15";
	var configURL = baseURL + 'configuration' + apiKey;
	var nowPlaying = baseURL + 'movie/now_playing' + apiKey;

	function Movie(title, releaseDate, poster, popularity) {
		this.title = title;
		this.releaseDate = releaseDate;
		this.poster = poster;
		this.popularity = popularity;
	}

	var imgBaseURL;
	$.getJSON(configURL, function(movieData) {
		imgBaseURL = movieData.images.base_url;
	});

	$.getJSON(nowPlaying, function(movieData) {
		var newHTML = '';
		for (i=0; i<movieData.results.length; i++) {
			var currentPoster = imgBaseURL + 'w300' + movieData.results[i].poster_path;
			var currentTitle = movieData.results[i].title;
			newHTML += '<div class="col-sm-3">';
			newHTML += '<img src="' + currentPoster + '">';
			newHTML += '</div>';
		}
		$('#poster-grid').html(newHTML);
	});

});