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
    }
}