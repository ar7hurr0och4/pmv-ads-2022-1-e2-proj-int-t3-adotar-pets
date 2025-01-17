import {Auth} from "./auth.js";

export class Api {
    
    #baseUrl;
    
    constructor(baseUrl) {
        this.#baseUrl = baseUrl;
    }
    
    #getEndpoint(endpoint) {
        return `${this.#baseUrl}/${endpoint}`;
    }
    
    static #baseHeaders() {
        return new Headers({
            'Content-Type': 'application/json',
        });
    }
    
    static #withBearer(headers, token) {
        if (!(headers instanceof Headers)) {
            throw new Error('Cabeçalho não fornecido.');
        }
        headers.append('Authorization', `Bearer ${token}`);
    }
    
    static async #getJsonResponse(request) {
        if (!(request instanceof Request)) {
            throw new Error('Requisição não fornecida.');
        }
        const response = await fetch(request);
        const json = await response.json();
        if (!response.ok) {
            throw new Error(JSON.stringify(json));
        }
        return json;
    }
    
    static #buildRequest(endpoint, method, useToken = false, data = null) {
        const headers = Api.#baseHeaders();
        if (useToken) {
            Api.#withBearer(headers, Auth.getToken());
        }
        const options = {method, headers};
        if (data instanceof FormData) {
            headers.delete('Content-Type');
            options.body = data;
        } else if (data) {
            options.body = JSON.stringify(data);
        }
        return new Request(endpoint, options);
    }
    
    async #get(endpoint, withToken = false) {
        const request = Api.#buildRequest(this.#getEndpoint(endpoint), 'GET', withToken);
        return await Api.#getJsonResponse(request);
    }

    async #post(endpoint, data = {}, withToken = false) {
        const request = Api.#buildRequest(this.#getEndpoint(endpoint), 'POST', withToken, data);
        return await Api.#getJsonResponse(request);
    }

    async #put(endpoint, data = {}, withToken = false) {
        const request = Api.#buildRequest(this.#getEndpoint(endpoint), 'PUT', withToken, data);
        return await Api.#getJsonResponse(request);
    }

    
    async register(userInfo) {
        return this.#post('auth/register', userInfo);
    }
    
    async login(credentials) {
        try {
            const user = await this.#post('auth/login', credentials);
            Auth.setToken(user.token);
            return user;
        } catch (e) {
            throw e;
        }
    }
    
    async info() {
        try {
            const user = await this.#get('user/profile', true);
            user.role = user.document.type === 0 ? 'adopter' : 'protector';
            return user;
        } catch (e) {
            throw e;
        }
    }

    async petInfo(id) {
        return await this.#get(`pet/profile/${id}`, true);
    }
    
    async searchPet(qs = ''){
        return await this.#get(`pet/search?${qs}`,true);
    }


    async addProfileImage(data) {
        try {
            return await this.#put('user/profile/picture', data, true);
        } catch (e) {
            throw e;
        }
    }

    async registerPet(data = {}) {
        return this.#post('pet/create', data, true);
    }
    
    async listPets() {
        return this.#get('pet', true);
    }
    
    async atualizarPerfil(endpoint, data = {}, withToken = false) {
        return this.#put(endpoint, data, withToken);
    }
    async atualizarSenha(endpoint, data = {}, withToken = false) {
        return this.#put(endpoint, data, withToken);
    }
    
    async ongInfo(id) {
        try {
            var ong = await this.#get(`user/profile/${id}`, true);
            return ong;
        } catch (e) {
            throw e;
        }
    }
    
    async getFormProgress(petId) {
        return this.#get(`form/adopt/${petId}`, true);
    }
    
    async answerForm(petId, alternativeId) {
        return this.#post(`form/adopt/${petId}`, {alternativeId}, true);
    }
    
    async listNeeds() {
        return this.#get('pet/needs', true);
    }
    
    async listAdoptionRequests(petId) {
        return this.#get(`pet/forms/${petId}`, true);
    }

    async formInfo(id) {
        return await this.#get(`form/${id}`, true);
    }
    
}