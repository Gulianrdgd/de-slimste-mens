import { Simulate } from 'react-dom/test-utils'

const pgp = require('pg-promise')();
const db = pgp('postgres://slimste:testtest@localhost:5432/slimste_dev');

  export async function query(username: string): Promise<any> {
    const q = 'select * from users where username =  $1';
    return await db.any(q, [username]);
  }

  export async function getQuestions(): Promise<any> {
    const q = 'SELECT * from questions';
    return await db.any(q);
  }

  export async function createQuestion(round:number, question: string, answers: any): Promise<any>{
    const q = 'INSERT into questions(round, question, answers) VALUES (${round},${question},${answers})';
    return await db.none(q, {round: round, question: question, answers: answers});
  }

  export async function toggleSlimsteMensStarted(): Promise<any> {
    const q0 = 'SELECT * from current_game';
    db.any(q0).then(async data => {
      if(data.size === 1){
        const q1 = 'UPDATE current_game SET hasStarted = ${started}';
        return await db.none(q1, data.hasStarted);
      }else{
        return console.error("No game round")
      }
    })
  }

