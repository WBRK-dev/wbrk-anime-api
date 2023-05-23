let tokens = [];

module.exports = {
    set: function(value) {
        tokens = value;
    },
    get: function() {
        return tokens;
    },
    push: function(value) {
        tokens.push(value);
    },
    find: function(sessionid) {
      let data = {accesstoken: "", refreshtoken: ""}
      console.log("searching for", sessionid, "available sessionids", [...tokens.map(t => t.sessionid)]);
      for (let i = 0; i < tokens.length; i++) {if (tokens[i].sessionid === sessionid) {data.accesstoken = tokens[i].access;data.refreshtoken = tokens[i].refresh;break;}}
      return data;
    }
}