import bcrypt from 'bcrypt';

const hash_pass = await bcrypt.hash('123456789', 10);
console.log(hash_pass);