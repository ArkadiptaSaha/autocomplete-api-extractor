const axios = require('axios');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_URL = 'http://35.200.185.69:8000/v1/autocomplete?query=';
const OUTPUT_FILE = 'names.csv';

const MAX_RETRIES = 5;       
const INITIAL_RETRY_DELAY = 1500;  
const MAX_DELAY = 10000;     

const getBackoffDelay = (attempt) => {
    const baseDelay = INITIAL_RETRY_DELAY * (2 ** attempt);  
    const jitter = Math.floor(Math.random() * 1000);         
    return Math.min(baseDelay + jitter, MAX_DELAY);          
};

// Function to append names to CSV immediately
const appendToCSV = async (names) => {
    if (names.length === 0) return;

    const csvWriter = createObjectCsvWriter({
        path: OUTPUT_FILE,
        header: [{ id: 'name', title: 'Name' }],
        append: fs.existsSync(OUTPUT_FILE) 
    });

    const records = names.map(name => ({ name }));

    await csvWriter.writeRecords(records);
    console.log(`Saved ${names.length} names to CSV`);
};

// Fetch names with backoff and append immediately
const fetchNames = async (query) => {
    let retries = 0;

    while (retries <= MAX_RETRIES) {
        try {
            const response = await axios.get(`${BASE_URL}${query}`);
            
            if (response.status === 200) {
                const names = response.data.results || [];
                if (names.length > 0) {
                    console.log(`Fetched ${names.length} names for query: "${query}"`);
                    await appendToCSV(names);  // Save immediately
                } else {
                    console.log(`No names for query: "${query}"`);
                }
                return;  
            }
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.warn(`Rate limited. Retrying... (Attempt ${retries + 1}/${MAX_RETRIES})`);
                const delay = getBackoffDelay(retries);
                console.log(`Waiting for ${delay / 1000} seconds...`);
                await sleep(delay);
                retries++;
            } else {
                console.error(`Error with query "${query}":`, error.message);
                return;  
            }
        }
    }

    console.error(`Failed after ${MAX_RETRIES} retries for query: "${query}"`);
};

// Generate prefixes
const generatePrefixes = () => {
    const prefixes = [];

    // Single-letter
    for (let i = 97; i <= 122; i++) {       
        prefixes.push(String.fromCharCode(i));
    }

    // Two-letter
    for (let i = 97; i <= 122; i++) {       
        for (let j = 97; j <= 122; j++) {   
            prefixes.push(`${String.fromCharCode(i)}${String.fromCharCode(j)}`);
        }
    }

    // Three-letter
    for (let i = 97; i <= 122; i++) {       
        for (let j = 97; j <= 122; j++) {   
            for (let k = 97; k <= 122; k++) { 
                prefixes.push(`${String.fromCharCode(i)}${String.fromCharCode(j)}${String.fromCharCode(k)}`);
            }
        }
    }

    console.log(`Generated ${prefixes.length} prefixes.`);
    return prefixes;
};

// Main function
const main = async () => {
    console.log('Starting name extraction...');

    const prefixes = generatePrefixes();

    for (let i = 0; i < prefixes.length; i++) {
        const prefix = prefixes[i];
        console.log(`Querying prefix: ${prefix} (${i + 1}/${prefixes.length})`);

        await fetchNames(prefix);
        await sleep(2000);  
    }

    console.log('All queries completed.');
};

main().catch(console.error);
