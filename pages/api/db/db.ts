const pgp = require('pg-promise')();
const db = pgp('postgres://slimste:testtest@localhost:5432/slimste_dev');

async function query(username: string) :Promise<any>{
  const q = 'select * from users where username =  $1';
  return await db.any(q, [username]);
}

export default query;