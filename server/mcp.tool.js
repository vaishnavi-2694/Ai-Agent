import { config } from "dotenv";
import { TwitterApi } from "twitter-api-v2";

// Load environment variables from .env file
config();

// Create a new Twitter API client
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Function to create a tweet
export async function createPost(status) {
    try {
        // Attempt to create the tweet
        const newPost = await twitterClient.v2.tweet(status);
        
        // Return the success response
        return {
            content: [
                {
                    type: "text",
                    text: `Tweeted: ${status}`
                }
            ]
        };
    } catch (error) {
        // Handle different types of errors
        if (error.response) {
            // If there's a response from Twitter API (e.g., authentication issue, rate limit error)
            console.error('Twitter API error:', error.response.data);
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to post tweet. Error: ${error.response.data.errors[0].message}`
                    }
                ]
            };
        } else if (error.request) {
            // If no response is received (e.g., network error)
            console.error('Network error:', error.request);
            return {
                content: [
                    {
                        type: "text",
                        text: "Network error: Unable to reach Twitter servers. Please try again later."
                    }
                ]
            };
        } else {
            // If the error is something else (e.g., programming error)
            console.error('Error:', error.message);
            return {
                content: [
                    {
                        type: "text",
                        text: `Unexpected error: ${error.message}`
                    }
                ]
            };
        }
    }
}
