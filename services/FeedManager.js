// API Address
const urlApi = "http://192.168.0.133:3000";

class FeedManager {


    async loadFeed(tokenId) {
        // Falta passar Token de autenticação
        const response = await fetch(
            urlApi + '/posts',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "tokenId": tokenId })
            }
        )

        const data = await response.json();
        return data;
    }

}

const feed = new FeedManager();
export default feed;