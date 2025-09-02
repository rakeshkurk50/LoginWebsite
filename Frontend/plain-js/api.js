// Simple, ES5-compatible global API service used by plain-js frontend
// Exposes `window.apiService`.
(function () {
    // Allow overriding API base via meta tag or global variable (set during build or injected by hosting)
    // Fallback to same-origin + /api so it works when frontend is served by backend
    var metaApi = (document.querySelector('meta[name="api-base"]') || {}).content;
    var BASE_URL = (window.__API_BASE__ && window.__API_BASE__.replace(/\/$/, '')) || (metaApi && metaApi.replace(/\/$/, '')) || (window.location.origin + '/api');

    var svc = {
        baseUrl: BASE_URL,
        token: localStorage.getItem('token') || null,

        setToken: function (token) {
            this.token = token;
            if (token) localStorage.setItem('token', token);
            else localStorage.removeItem('token');
        },

        getHeaders: function () {
            var headers = { 'Content-Type': 'application/json' };
            if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
            return headers;
        },

        handleResponse: function (response) {
            // Handle responses with no JSON body (204 or empty body) and non-JSON responses
            var contentType = response.headers.get('content-type') || '';
            if (response.status === 204) return Promise.resolve({});

            if (contentType.indexOf('application/json') === -1) {
                // Try to read as text for better error messages; if empty, return empty object
                return response.text().then(function (text) {
                    var data = null;
                    try {
                        data = text ? JSON.parse(text) : null;
                    } catch (e) {
                        data = null;
                    }

                    if (!response.ok) {
                        var msg = (data && (data.message || data.error)) || text || ('HTTP ' + response.status);
                        var err = new Error(msg);
                        err.payload = data || text;
                        throw err;
                    }
                    return data || {};
                });
            }

            // Default: parse JSON, but guard against empty body
            return response.text().then(function (text) {
                if (!text) {
                    if (!response.ok) {
                        var err = new Error('Empty response from server');
                        err.payload = null;
                        throw err;
                    }
                    return {};
                }
                try {
                    var data = JSON.parse(text);
                } catch (e) {
                    if (!response.ok) {
                        var err = new Error('Invalid JSON in response');
                        err.payload = text;
                        throw err;
                    }
                    return {};
                }

                if (!response.ok) {
                    var msg = (data && (data.message || data.error)) || 'Server error';
                    var err = new Error(msg);
                    err.payload = data;
                    throw err;
                }
                return data;
            });
        },

        register: function (userData) {
            return fetch(this.baseUrl + '/auth/register', {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(userData)
            }).then(this.handleResponse.bind(this)).then(function (data) {
                if (data.token) svc.setToken(data.token);
                return data;
            });
        },

        login: function (credentials) {
            return fetch(this.baseUrl + '/auth/login', {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(credentials)
            }).then(this.handleResponse.bind(this)).then(function (data) {
                if (data.token) svc.setToken(data.token);
                return data;
            });
        },

        getAllUsers: function () {
            return fetch(this.baseUrl + '/users', { headers: this.getHeaders() }).then(this.handleResponse.bind(this));
        },

        getUser: function (id) {
            return fetch(this.baseUrl + '/users/' + encodeURIComponent(id), { headers: this.getHeaders() }).then(
                this.handleResponse.bind(this)
            );
        }
    };

    // Expose globally
    window.apiService = svc;

    // Lightweight connectivity test
    try {
        fetch(window.apiService.baseUrl + '/auth/test')
            .then(function (r) {
                if (r.ok) console.debug('API reachable');
                else console.warn('API responded with status ' + r.status);
            })
            .catch(function (err) {
                console.warn('API connectivity test failed: ' + (err && err.message));
            });
    } catch (e) {
        console.warn('API test skipped: ' + (e && e.message));
    }
})();
