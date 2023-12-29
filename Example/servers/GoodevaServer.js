class GoodevaServer {
    static currentServer = {
        baseurl: 'https://dev4.goodeva.gss-login.com/api/',
    };

    static getGoodevaServer() {
        return this.currentServer;
    }
}

export default GoodevaServer;