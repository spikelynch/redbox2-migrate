/////////
// Node entry point for Stash 3.0 migration scripts
/////////
/////////
// support folder in redbox-portal for load testing harness
/////////

const solr = require('solr-client');

// const URL = 'https://etc.mikelynch.org/json/index.json';

const URL = 'https://test-redbox.research.uts.edu.au/solr/fascinator/select?q=(item_type:object)'


https://test-redbox.research.uts.edu.au/redbox/verNum1.9/dashboard/getRecords.script?packageType=dmpt&pageNum=1'

var HOST = 'https://test-redbox.research.uts.edu.au';
var PORT = 443;
var CORE = 'fascinator'
var PATH = 'solr'


function fetch_solr(client, q) {
    let query = client.createQuery().q(q);
    return new Promise(function (resolve, reject) {
        client.search(query, function (err, obj) {
            if( err ) {
                console.log("Solr error");
                reject(err);
            } else {
                resolve(obj);
            }
        });
    });
}


async function main(host, port, core, path) {
    let cl
    try {
        let client = solr.createClient(host, port, core, path);
        let result = await fetch_solr(client, 'item_type:object');
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}


main(HOST, PORT, CORE, PATH);