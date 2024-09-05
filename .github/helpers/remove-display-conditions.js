const yaml = require('js-yaml');
const fs = require('fs');

let doc = yaml.load(fs.readFileSync('./manifest.yml', 'utf-8'));

delete doc.modules['jira:projectPage'][0].displayConditions;

fs.writeFileSync('./manifest.yml', yaml.dump(doc));