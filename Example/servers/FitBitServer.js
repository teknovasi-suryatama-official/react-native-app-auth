class FitBitServer {
    static currentServer = {
        baseurl: 'https://api.fitbit.com/',
    };

    static getFitBitServer() {
        return this.currentServer;
    }
}

export default FitBitServer;