// API Address
const urlApi = "http://192.168.0.133:3000";

class FeedManager {
    

    async loadFeed() {
        // Falta passar Token de autenticação
        const response = await fetch(
            urlApi + '/posts'
        )
        const data = await response.json();
        return data;
    }

}

const feed = new FeedManager();
export default feed;