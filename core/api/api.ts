import { APIRequestContext } from '@playwright/test';
import { ENV } from '../../env/env';

export class APIHelper {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * Register a new user
     */
    async registerUser(userData: { username: string; password: string; name: string }) {
        const response = await this.request.post(`${ENV.BASE_URL}/api/auth/register`, {
            data: userData,
        });
        return { status: response.status(), body: await response.json().catch(() => ({})) };
    }

    /**
     * Login user and get token
     */
    async loginUser(username: string, password: string): Promise<string> {
        const response = await this.request.post(`${ENV.BASE_URL}/api/auth/login`, {
            data: { username, password },
        });
        const body = await response.json().catch(() => ({}));
        return body.token || body.accessToken || '';
    }

    /**
     * Get current user profile
     */
    async getProfile(token: string) {
        const response = await this.request.get(`${ENV.BASE_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    /**
     * Update profile name via PATCH /api/profile
     */
    async updateProfile(name: string, token: string) {
        const response = await this.request.patch(`${ENV.BASE_URL}/api/profile`, {
            data: { name },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    /**
     * Get products list
     */
    async getProducts(token: string) {
        const response = await this.request.get(`${ENV.BASE_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({ data: [] }));
    }

    /**
     * Get current cart
     */
    async getCart(token: string) {
        const response = await this.request.get(`${ENV.BASE_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({ items: [] }));
    }

    /**
     * Update (overwrite) cart
     */
    async updateCart(items: any[], token: string) {
        const response = await this.request.put(`${ENV.BASE_URL}/api/cart`, {
            data: { items },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    /**
     * Clear cart
     */
    async clearCart(token: string) {
        return this.updateCart([], token);
    }

    /**
     * Create an order via API (seed data for tests)
     */
    async createOrder(orderData: any, token: string) {
        const response = await this.request.post(`${ENV.BASE_URL}/api/orders`, {
            data: orderData,
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({}));
    }

    /**
     * Get all orders for current user
     */
    async getOrders(token: string) {
        const response = await this.request.get(`${ENV.BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json().catch(() => ({ data: [] }));
    }

    /**
     * Delete one order
     */
    async deleteOrder(orderId: string, token: string) {
        const response = await this.request.delete(`${ENV.BASE_URL}/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status();
    }

    /**
     * Delete all orders for current user
     */
    async deleteAllOrders(token: string) {
        const response = await this.request.delete(`${ENV.BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status();
    }
}
