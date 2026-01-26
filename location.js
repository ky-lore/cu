const axios = require('axios');
let data = JSON.stringify({
  "name": "Mark Shoes",
  "phone": "+1410039940",
  "companyId": "UAXssdawIWAWD",
  "address": "4th fleet street",
  "city": "New York",
  "state": "Illinois",
  "country": "US",
  "postalCode": "567654",
  "website": "https://yourwebsite.com",
  "timezone": "US/Central",
  "prospectInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@mail.com"
  },
  "settings": {
    "allowDuplicateContact": false,
    "allowDuplicateOpportunity": false,
    "allowFacebookNameMerge": false,
    "disableContactTimezone": false
  },
  "social": {
    "facebookUrl": "https://www.facebook.com/",
    "googlePlus": "https://www.googleplus.com/",
    "linkedIn": "https://www.linkedIn.com/",
    "foursquare": "https://www.foursquare.com/",
    "twitter": "https://www.foutwitterrsquare.com/",
    "yelp": "https://www.yelp.com/",
    "instagram": "https://www.instagram.com/",
    "youtube": "https://www.youtube.com/",
    "pinterest": "https://www.pinterest.com/",
    "blogRss": "https://www.blogRss.com/",
    "googlePlacesId": "ChIJJGPdVbQTrjsRGUkefteUeFk"
  },
  "twilio": {
    "sid": "AC_XXXXXXXXXXX",
    "authToken": "77_XXXXXXXXXXX"
  },
  "mailgun": {
    "apiKey": "key-XXXXXXXXXXX",
    "domain": "replies.yourdomain.com"
  },
  "snapshotId": "XXXXXXXXXXX"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://services.leadconnectorhq.com/locations/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Version': '2021-07-28',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQkhkM1JEekg1M3BUbW1UVTFYdmIiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3Njg5MzQ3OTY1NjQsInN1YiI6InZHQUx0RVRwV3FuaEJZQkM1VXl4In0.50yV2rtsVR9Aw5bWMbzP7uWIAilixQ8-oicNo8JI7co'
  },
  data: data
};

axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });