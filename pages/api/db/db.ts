const pgp = require('pg-promise')();
const db = pgp('postgres://slimste:testtest@localhost:5432/slimste_dev');

  export async function query(username: string): Promise<any> {
    const q = 'select * from users where username =  $1';
    return await db.any(q, [username]);
  }

  export async function getQuestions(): Promise<any> {
    const q = 'select * from questions';
    return await db.any(q);
  }

  export async function createQuestion(round:number, question: string, answers: any): Promise<any>{
    const q = 'insert into questions(round, question, answers) values (${round},${question},${answers})';
    return await db.none(q, {round: round, question: question, answers: answers});
  }



