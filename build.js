const fs = require('fs');

const requiredFiles = [
    'index.html',
    'style.css',
    'script.js'
];

console.log('Starting application build validation...');

for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        console.error(`Build Failed: ${file} not found`);
        process.exit(1);
    }
}

console.log('Application files validated successfully.');
console.log('Build completed successfully.');