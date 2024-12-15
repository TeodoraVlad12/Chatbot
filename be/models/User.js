const { v4: uuidv4 } = require('uuid');

class User {
    constructor(userId, username, password) {
        this.id = userId;
        this.username = username;
        this.password = password;
    }
}

module.exports = User;
