// Author: Chloe Choe
// Description: Bot that retweets every hour from a queue of public tweets with hashtag #giveaway

// Using the Twit node package
// https://github.com/ttezel/twit

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

var params = {
	q: 'hi',
	count: 10
}

T.get('search/tweets', params, gotData);

function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++) {
		console.log(tweets[i].text);
	}
}
function postTweet(myText) {
	var tweet = {
		status: myText
	}
	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log("Error in tweeted().");
			console.log();
		} else {
			console.log("It worked.");
		}
	}
}

setInterval(postTweet, 1000*60) { //every minute

}

//set up a user stream
var stream = T.stream('user');

//anytime someone follows me...
stream.on('follow', followed);

function followed(eventMsg) {
	var name = event.source.name;
	var screenName = eventMsg.source.screen_name;
	postTweet('@' + screenName + 'Thanks for following!');
}
