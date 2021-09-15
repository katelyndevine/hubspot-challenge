const axios = require("axios");
console.log("hiiiiiii");
const api_token = "a1c3890596a4a164bb220b3e4deb"; // need to hide this
const url =
  "https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=a1c3890596a4a164bb220b3e4deb"; // need to template string this

const finalUrl =
  "https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=a1c3890596a4a164bb220b3e4deb"; //need to template string this

const get = async () => {
  console.log("yoyypypypyp");
  try {
    console.log("MADE IT HERE HEHEHEHEEHEH");
    const { data } = await axios.get(url);
    // console.log(data);
    createSessionByUser(data);
  } catch (err) {
    console.log("error in get!", err);
  }
};

get();

function createSessionByUser(data) {
  let eventsByUser = {};
  for (let i = 0; i < data.events.length; i++) {
    let event = data.events[i];
    // console.log("this is a single event", event);
    const { url, visitorId, timestamp } = event;
    if (!(visitorId in eventsByUser)) {
      eventsByUser[visitorId] = [];
    }
    eventsByUser[visitorId].push(event);
  }
  // console.log("this is eventsByUser", eventsByUser);
  const sessionByUser = {};

  // sort each user session by timestamp to be in chronological order
  for (let user in eventsByUser) {
    console.log(("this is user in object loop", user));
    eventsByUser[user].sort((a, b) => b.timestamp - a.timestamp);
    console.log("this is new eventsByUser after sorting", eventsByUser);
  }
}
