const { OpenAIAPIKey } = require('./config');

class OpenAIAPI {
    static async generateResponse(userMessage, conversationHistory = []) {
        //OPEN API key part
        var isPersonalAPIKey = false;
        var apiKey = process.env.OPENAI_API_KEY;
        if (OpenAIAPIKey != "") {
            console.log("Personal part 1 start");
            isPersonalAPIKey = true;
            apiKey = OpenAIAPIKey;
        } 
        console.log("@@ isPersonalAPIKey:", isPersonalAPIKey);
        console.log("@@ apiKey:", apiKey);

        //API PART
        var endpoint = "";
        var response = null;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };
        if (!isPersonalAPIKey) {
            endpoint = 'https://api.openai.com/v1/chat/completions';
            response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-1106",
                    messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
                    max_tokens: 150
                }),
            });
        }
        else {
            console.log("Personal part 2 start");
            endpoint = 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions';
            response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    prompt: userMessage,
                    max_tokens: 150,
                }),
            }); 
        }
        

        // RESPONSE parts
        const responseData = await response.json();
        if (!isPersonalAPIKey) {
            // Log the entire API response for debugging
            console.log('Response from OpenAI API:', responseData.choices[0].message);

            // Check if choices array is defined and not empty
            if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
                return responseData.choices[0].message.content;
            } else {
                // Handle the case where choices array is undefined or empty
                console.error('Error: No valid response from OpenAI API');
                return 'Sorry, I couldn\'t understand that.';
            }
        }
        else {
            console.log("Personal part 3 start");

            // Log the entire API response for debugging
            console.log('Response from OpenAI API:', responseData);
            // Check if choices array is defined and not empty
            if (responseData.choices && responseData.choices.length > 0) {
                return responseData.choices[0].text.trim();
            } else {
                // Handle the case where choices array is undefined or empty
                console.error('Error: No valid response from OpenAI API');
                return 'Sorry, I couldn\'t understand that.';
            }
        }

    }
}
module.exports = { OpenAIAPI };