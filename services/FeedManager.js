// API Address
import { URL_API } from "./secretKeys";

class FeedManager {


    async loadFeed(tokenId) {
        // Falta passar Token de autenticação
        const response = await fetch(
            URL_API + '/posts',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "tokenId": tokenId, "page": 0, "limit": 2 })
            }
        )

        const data = await response.json();
        return data;
    }

}

const feed = new FeedManager();
export default feed;