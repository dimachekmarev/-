// Шифрует платный контент (private/) в content.enc. Ключ — переменная CONTENT_KEY (64 hex).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const key = Buffer.from(process.env.CONTENT_KEY || '', 'hex'); if (key.length !== 32) throw new Error('CONTENT_KEY: 64 hex');
const files = {}; for (const f of fs.readdirSync(path.join(__dirname, 'private'))) files[f] = fs.readFileSync(path.join(__dirname, 'private', f), 'utf8');
const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', key, iv);
const enc = Buffer.concat([c.update(JSON.stringify(files)), c.final()]);
fs.writeFileSync(path.join(__dirname, 'content.enc'), Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64'));
console.log('sealed', Object.keys(files).length, 'files');
