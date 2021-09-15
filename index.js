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
    const { url, visitorId, timestamp } = event;
    if (!(visitorId in eventsByUser)) {
      eventsByUser[visitorId] = [];
    }
    eventsByUser[visitorId].push(event);
  }
  const sessionByUser = {};

  // sort each user session by timestamp to be in chronological order
  for (let user in eventsByUser) {
    eventsByUser[user].sort((a, b) => a.timestamp - b.timestamp);
    // console.log("this is new eventsByUser after sorting", eventsByUser);
  }

  for (let user in eventsByUser) {
    let sessionsList = [];
    //compare current timestamp to the next one to see if they are wi 10mins
    for (let i = 0; i < eventsByUser[user].length - 1; i++) {
      let currentObj = eventsByUser[user][i];
      let prevObj = eventsByUser[user][i - 1];
      if (i === 0) {
        const newSession = {
          duration: 0,
          pages: [currentObj.url],
          startTime: currentObj.timestamp,
        };
        sessionsList.push(newSession);
      } else {
        // console.log("this is currentObj", currentObj);
        let timeDiffInMins = (currentObj.timestamp - prevObj.timestamp) / 60000;
        // console.log("this is timedif", timeDiffInMins);
        if (timeDiffInMins <= 10) {
          let currentSession = sessionsList[sessionsList.length - 1];
          let currDuration = currentObj.timestamp - prevObj.timestamp;

          currentSession.duration += currDuration;
          currentSession.pages.push(currentObj.url);
        } else {
          const newSession = {
            duration: 0,
            pages: [currentObj.url],
            startTime: currentObj.timestamp,
          };
          sessionsList.push(newSession);
        }
      }
    }
    sessionByUser[user] = sessionsList;
  }

  // console.log("this is sessionsList: ", sessionsList);
  console.log("this is final!", sessionByUser);
}
