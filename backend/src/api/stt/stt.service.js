const axios = require('axios');

async function speechToText(language_code, audio) {
    const response = await axios.post(
        process.env.API_URL, {
            arguments: {
                language_code: "korean",
                audio: audio
            }
        },
        {
            headers: {
                'Authorization': process.env.ETRI_API_KEY,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }
    );
    return response.data;
}