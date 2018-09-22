// Author: Chloe Choe
// Description: Bot that retweets every hour from a queue of public tweets with hashtag #giveaway

// Using the Twit node package
// https://github.com/ttezel/twit

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

var params = {
	q: '#giveaway',
	count: 10
}

var tweetIdQueue = [];

var id, id_str;

//track public streamed tweets for term 'giveaway'
var giveawayStream = T.stream('statuses/filter', { track: 'giveaway' })

//anytime a tweet with #giveaway shows up, call gotData
giveawayStream.on('tweet', function(tweet) {
	//var for entire JSON of tweets from stream
	id_str = Object.values(tweet)[2]; //this is id_str
	
	tweetIdQueue.push(id_str);

})

setInterval(() => retweetTweet(), 1000*60*30); //retweet every 30 minutes

function gotData(err, data, response) {

	 while (data !== "undefined") {
	 	//var for entire JSON of tweets from stream
		var tweets = data.statuses;
		//works but gets undefined stream--add error catching
		for (var i = 0; i < tweets.length; i++) {
			var values = Object.values(tweets[i]);
			//go for status that doesn't have RT in the beginning
			if (tweets[i].text.charAt(0) == 'R' && tweets[i].text.charAt(1) == 'T') {
				//remove from queue
			} else {
				console.log(tweets[i].text);
				console.log(values[2]); //[2] is the id_str
			}
		}
		if (data !== "undefined") {
			console.log("Waiting for new status to get posted...");
			setTimeout(gotData, 1000*60*5); //try gotData status again in five minutes
		}
	 }
}

function retweetTweet() {

	//  get the id of the firstTweet in the queue
	var firstTweetId = tweetIdQueue.shift();	

	console.log(firstTweetId);

	T.post('statuses/retweet/:id', { id: firstTweetId }, function (err, data, response) {
		console.log(data);
	});
}




//Node.js modeule to read/write files from local hard drive

function writeToFile(eventMsg) {
	var fs = require('fs');
	var json = JSON.stringify(eventMsg,null,2);
	var myIdValues = Object.values(json.user);
	id = myIdValues[0];
	id_str = myIdValues[1];
	fs.writeFile("tweet.json", json);
}



//function to follow back a user
function followed(eventMsg) {
	var name = event.source.name;
	var screenName = eventMsg.source.screen_name;
	postTweet('@' + screenName + 'Thanks for following!');
}


function tweetEvent(eventMsg) {
	var tweetReply = eventMsg.in_reply_to_screen_name;
	var tweetIsFrom = eventMsg.user.screen_name;
	//make use of what is in tweetText and json file to change
	//what is tweeted
	var tweetText = eventMsg.txt;

	if (tweetReply === 'chloeschoe') {
		var myTweet = '@' + tweetIsFrom + ' hello!'
		postTweet(myTweet);
	}
}


//post a tweet with myText
function postTweet(myText) {
	var tweet = {
		status: "Hello, bot running."
	}
	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log("Error in tweeted().");
			console.log();
		} else {
			console.log("Tweet has posted.");
		}
	}
}


