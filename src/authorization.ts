import http from 'http';
import jwt from 'jsonwebtoken';

export function authorize(request: http.IncomingMessage, publicKey: string): void {
    const token = getAuthorizationToken(request);
    jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
    });
}

function getAuthorizationToken(request: http.IncomingMessage): string {
    const token = request.headers.authorization;
    if (token === null || token === undefined) {
        throw new Error("The request does not contains an authorization token");
    }
    return (token.startsWith('Bearer ')) ? getTokenWithoutBearerPrefix(token) : token;
}

function getTokenWithoutBearerPrefix(token: string): string {
    return token.slice(7);
}
