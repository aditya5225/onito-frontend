import axios from "axios";

const HTTPClient = {
	url: function (path) {
		const host = "http://localhost:5000";
		return `${host}/${path}`;
	},

	addHeaders: function () {
		return {
			"sample-access-key": "sample-access-value",			// Key and value for api access validation
			"authorization": 'bearer token',					// Token validation for auth
		};
	},

	get: async function (path, query = '', callback) {
		const result = await axios.get(`${this.url(path)}?${query}`, {
			headers: {
				...this.addHeaders()
			}
		});

		callback(result.data);
	},

	post: async function (path, values, callback) {
		const result = await axios.post(this.url(path), values, {
			headers: {
				...this.addHeaders()
			}
		});

		callback(result.data);
	},

	patch: async function (path, values, callback) {
		const result = await axios.patch(this.url(path), values, {
			headers: {
				...this.addHeaders()
			}
		});

		callback(result.data);
	},

	put: async function (path, values, callback) {
		const result = await axios.put(this.url(path), values, {
			headers: {
				...this.addHeaders()
			}
		});

		callback(result.data);
	},

	delete: async function (path, params, callback) {
		const result = await axios.delete(this.url(path), params, {
			headers: {
				...this.addHeaders()
			}
		});

		callback(result.data);
	},
};

export default HTTPClient;
