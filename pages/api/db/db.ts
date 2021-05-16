const bcrypt = require('bcrypt')

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

  export async function getUsers(): Promise<any> {
    const q = 'SELECT * from users';
    return await db.any(q);
  }

  export async function createQuestion(round:number, question: string, answers: any): Promise<any>{
    const q = 'INSERT into questions(round, question, answers) VALUES (${round},${question},${answers})';
    return await db.none(q, {round: round, question: question, answers: answers});
  }

export async function createUser(username:number, password1: string, password2: string, role: string): Promise<any>{
  const q = 'INSERT into users(username, password_hash, role) VALUES (${username},${hash},${role})';
  if(password1===password2){
    bcrypt.hash(password1, 10, function(err, hash) {
      return db.none(q, {username: username, hash: hash, role: role});
    });
  }else{
    return;
  }
}

  export async function toggleSlimsteMensStarted(): Promise<any> {
    const q0 = 'SELECT * from current_game';
    return db.any(q0).then(data => {
      if(data.length === 1){
        const q1 = 'UPDATE current_game SET has_started =  ' + !data[0].has_started;
        return db.none(q1);
      }
    })
  }

  export async function nextRound(): Promise<any> {
    return getCurrentGame().then(e => {
      const nextRound = e.round === 4 ? 0 : (e.round + 1)
      if(nextRound === 1){
        const q0 = 'UPDATE current_game SET round = ' + nextRound + " , round1 = 0";
        return db.none(q0)
      }else{
        const q0 = 'UPDATE current_game SET round = ' + nextRound;
        return db.none(q0)
      }
    })
  }

export async function toggleSlimsteMensTimer(): Promise<boolean> {
  const q0 = 'SELECT * from current_game';
  return db.any(q0).then(data => {
    if(data.length === 1){
      const q1 = 'UPDATE current_game SET timer_started =  ' + !data[0].timer_started;
      return db.none(q1).then(() => {
        return new Promise( resolve => {
          resolve(!data[0].timer_started)
        })
      });
    }
  })
}

export async function toggleShowQuestion(): Promise<any> {
  const q0 = 'SELECT show_question from current_game';
  return db.any(q0).then(data => {
    if(data.length === 1){
      const q1 = 'UPDATE current_game SET show_question =  ' + !data[0].show_question;
      return db.none(q1);
    }
  })
}

  export async function getCurrentGame(): Promise<any> {
    const q0 = 'SELECT * FROM current_game';
    return db.any(q0).then( data => {
      if(data.length === 1){
        const q1 = 'SELECT * FROM questions WHERE qid =  ' + data[0].current_question;
        return db.any(q1).then(question => {
          const q2 = 'SELECT username FROM users WHERE id =  ' + data[0].current_player;
          return db.any(q2).then(user => {
            const q3 = 'SELECT id,username,time,role FROM users WHERE id = ' + data[0].players[0] + " OR id = " + data[0].players[1] + " OR id = " + data[0].players[2];
            return db.any(q3).then(players => {
              return new Promise(resolve => {
                resolve({round: data[0].round, current_question: question[0], current_player: user[0].username,
                  has_started: data[0].has_started, current_answered: data[0].current_answered,
                  timer_started: data[0].timer_started, players: players, show_question: data[0].show_question, round1: data[0].round1})
              })
            })
          })
        })
      }else{
        return new Promise(resolve => {
          resolve(console.error("No game round"))
        })
      }
    })
  }

  export async function setCorrectAnswer(index: number): Promise<any>{
    const q0 = 'SELECT * FROM current_game';
    return db.any(q0).then( data => {
      const tmpAns = data[0].current_answered
      tmpAns[index] = true;
      if(data[0].round === 1) {
        const q1 = 'UPDATE current_game SET current_answered = ' + pgp.as.array(tmpAns) + ", round1 = " + (data[0].round1 + 1);
        console.log(q1);
        return db.none(q1).then(() => {
          return new Promise(resolve => {
            resolve(true)
          })
        })
      }else{
        const q1 = 'UPDATE current_game SET current_answered = ' + pgp.as.array(tmpAns);
        return db.none(q1).then(() => {
          return new Promise(resolve => {
            resolve(true)
          })
        })
      }
    })
  }

  export async function addSeconds(username: string, amount: number): Promise<any>{
    return getSeconds(username).then(data => {
      const q1 = 'UPDATE users SET time =  ' + (data.time + amount) + " WHERE username = '" + username + "'" ;
      console.log(q1);
      return db.none(q1);
    })
  }

  export async function setSeconds(username: string, amount: number): Promise<any>{
    console.log(username, amount)
    const q1 = 'UPDATE users SET time =  ' + amount + " WHERE username = '" + username + "'" ;
    return db.none(q1);
  }

  export async function getSeconds(username: string): Promise<any>{
    const q0 = "SELECT time FROM users WHERE username = '" + username + "'"
    console.log(q0);
    return db.any(q0).then(data => {
      return new Promise( resolve => {
        resolve(data[0])
      })
    });
  }

  export async function nextUser(): Promise<any> {
    const q0 = "SELECT * FROM current_game";
    return db.any(q0).then(data => {
      let pos = data[0].players.indexOf(String.fromCharCode('0'.charCodeAt(0) + data[0].current_player))+1
      if (pos > 2){
        pos = 0;
      }
      const q1 = "UPDATE current_game SET current_player = $1";
      return db.none(q1, data[0].players[pos]);
    })
  }

  export  async  function nextQuestion(round: number): Promise<any>{
    const q0 = "SELECT * FROM questions WHERE round = " + round + " order by random()";
    return db.any(q0).then((qid) => {
      const tmp = []
      console.log(qid)
      for(const l in qid[0].answers){
        tmp.push(false);
      }
      const q1 = "UPDATE current_game SET current_question = $1, current_answered = $2";
      console.log(q1);
      return db.none(q1, [qid[0].qid, tmp]);
    })
  }


