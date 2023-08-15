export const storage = {
    local: {
        set(key, value) {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return storage.local;
        },
        get(key) {
            const value = localStorage.getItem(key);
            if (value) {
                return value;
            }
            else {
                return null;
            }
        },
        getUseJSON(key) {
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            }
            else {
                return null;
            }
        },
        remove(key) {
            localStorage.removeItem(key);
            return storage.local;
        },
        clear() {
            localStorage.clear();
            return storage.local;
        }
    },
    session: {
        set(key, value) {
            sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return storage.session;
        },
        get(key) {
            const value = sessionStorage.getItem(key);
            if (value) {
                return value;
            }
            else {
                return null;
            }
        },
        getUseJSON(key) {
            const value = sessionStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            }
            else {
                return null;
            }
        },
        remove(key) {
            sessionStorage.removeItem(key);
            return storage.session;
        },
        clear() {
            sessionStorage.clear();
            return storage.session;
        }
    },
};