const Spotify = require("spotifydl-core").default;

const client = new Spotify({
	clientId: "acc6302297e040aeb6e4ac1fbdfd62c3",
	clientSecret: "0e8439a1280a43aba9a5bc0a16f3f009",
});

const spotify = (url) =>
	new Promise(async (resolve, reject) => {
		try {
			let hasil = await client.getTrack(url);
			let mp3 = await client.downloadTrack(url);
			let result = {
				name: hasil.name,
				artist: hasil.artists.join(","),
				release_date: hasil.release_date,
				album: hasil.album_name,
				cover: hasil.cover_url,
				url: mp3,
			};
			resolve(result);
		} catch (e) {
			reject(e);
		}
	});

module.exports = spotify.bind();
