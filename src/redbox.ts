
// A class which connects to a ReDBox instance via its API
// Uses the axios module to do the https connection


import axios from 'axios';
import { AxiosInstance } from 'axios';
const qs = require('qs');
//import { Spinner } from 'cli-spinner';

/**
    Class for working with the ReDBox API

*/

export class ReDBox {

    baseURL: string;
    apiKey: string;
    ai: AxiosInstance;
//    spinner: Spinner;

    /* using a custom serialiser because axios' default 
       URL-encodes the solr query string for search */
    
    constructor(baseURL: string, apiKey: string) {
	this.baseURL = baseURL;
	this.apiKey = apiKey;
	this.ai = axios.create({
	    baseURL: this.baseURL,
	    headers: {
		"Authorization": "Bearer " + this.apiKey,
		"Content-Type": "application/json"
	    },
	    paramsSerializer: function(params) {
		return qs.stringify(params, { encode: false });
	    }
	});
    }

    async apiget(path: string, params?: Object): Promise<Object|undefined> {
	let url = path;
	if( url[0] !== '/' ) {
	    url = '/' + url;
	}
	try {
	    let config = {};
	    if( params ) {
		config["params"] = params;
	    }
	    let response = await this.ai.get(url, config);
	    if( response.status === 200 ) {
		return response.data;
	    }
	} catch ( e ) {
	    return undefined;
	}
    }

    async info(): Promise<Object> {
	try {
	    let resp = await this.apiget('/info');
	    return resp;
	} catch(e) {
	    console.log(e);
	    return {};
	}
    }

    /* search returns a list of all the items in the
       ReDBox of the specified type */
 
    async search(ptype: string, start?:number): Promise<string[]> {
	let q = 'packageType:' + ptype;

	if( start === undefined ) {
	    start = 0;
	}

	try { 
	    let params = { q: q, start: start };
	    let resp = await this.apiget('search', params);
	    let response = resp["response"];
	    let numFound = response["numFound"];
	    let docs = response["docs"];
	    let ndocs = docs.length
	    let list = docs.map(d => d.id);
	    console.log("Received " + start);
	    if( start + ndocs < numFound ) {
		let rest = await this.search(ptype, start + ndocs);
		return list.concat(rest);
	    } else {
		return list;
	    }
	} catch(e) {
	    console.log("Error " + e);
	    return [];
	}
    }

    async recordmeta(oid: string): Promise<Object|undefined> {
	try {
	    let response = await this.apiget('recordmetadata/' + oid);
	    return response;
	} catch(e) {
	    console.log("Error " + e);
	    return undefined;
	}
    }
	
    
}



