import axios from 'axios';
import { ContextPathMap } from '../config/settings.js';

export class AuthenticationError extends Error {
    constructor(code, message) {
        super(message);
        this.error = true;
        this.code = code;
        this.errorMessage = message;
    }
};

export const authenticate = async (req, next) => {
    try {
        let jwtToken = req.headers['authorization'];
        if (!jwtToken) throw new AuthenticationError('MISSING_TOKEN', "Missing token");
        jwtToken = jwtToken?.split(' ')[1]; // Extract token
        if (!jwtToken) throw new AuthenticationError('MISSING_TOKEN', "Invalid token format");
        console.log('JWT Token:', jwtToken);

        const authenticationUrl = `http://${ContextPathMap.get('id')}/authenticate`;
        console.log('---------------------');
        console.log('Authentication URL:', authenticationUrl);
        try {
            const response = await axios.post(
                authenticationUrl,
                {jwtToken: jwtToken},
                {
                    validateStatus: (status) => status < 500 // Accept 2xx and 3xx responses
                }
            );

            if (response.status === 200) {
                console.log('Authentication successful:', response.data);
                return response.data['result'];
            }
            else if (response.status === 401) {
                throw new AuthenticationError('AUTHENTICATION_INVALID', "Authentication invalid");
            }
            else {
                throw new AuthenticationError('CANNOT_AUTHENTICATE', "Cannot authenticate");
            }
        } catch (error) {
            console.log(`ERROR received from ${authenticationUrl}: ${error}\n`);
            next(error);
        }
    } catch (error) {
        next(error);
    }
    return null;
};
