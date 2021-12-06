const request = require('request');

const fetchMyIP = function(callback) { 
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });// use request to fetch IP address from JSON API
};
  

const fetchCoordsByIP = function(ip, callback) {
    request(`https://freegeoip.app/json/198.161.51.162`, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
  
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
        return;
      }
  
      const { latitude, longitude } = JSON.parse(body);
  
      callback(null, { latitude, longitude });
    });
  };


const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=53.5417&lon=-113.5005`, (error, response, body) => {
    if (error) {
        callback(error, null);
        return;
    }
      
    if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
        return;
    }
      
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
  
      fetchCoordsByIP(ip, (error, loc) => {
        if (error) {
          return callback(error, null);
        }
  
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }
  
          callback(null, nextPasses);
        });
      });
    });
  };
      
module.exports = { nextISSTimesForMyLocation };    