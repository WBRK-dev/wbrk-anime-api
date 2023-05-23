module.exports = {
    tokens: [],
    set: function(value) {
        this.tokens = value;
    },
    get: function() {
        return this.tokens;
    },
    push: function(value) {
        this.tokens.push(value);
    },
    find: function(sessionid) {
      let data = {accesstoken: "", refreshtoken: ""}
      console.log("searching for", sessionid, "available sessionids", [...this.tokens.map(t => t.sessionid)]);
      for (let i = 0; i < this.tokens.length; i++) {if (this.tokens[i].sessionid === sessionid) {data.accesstoken = this.tokens[i].access;data.refreshtoken = this.tokens[i].refresh;break;}}
      return data;
    }
}