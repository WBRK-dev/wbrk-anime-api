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
        for (let i = 0; i < tokens.length; i++) {if (tokens[i].sessionid === sessionid) {data.accesstoken = tokens[i].access;data.refreshtoken = tokens[i].refresh;break;}}
        return data;
    }
}