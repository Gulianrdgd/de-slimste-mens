import express, { Express, Request, Response } from 'express'
import next from "next";
import {
  createQuestion,
  createUser,
  getCurrentGame,
  getQuestions,
  getUsers, nextQuestion, nextRound, nextUser, setCorrectAnswer, setSeconds, toggleShowQuestion,
  toggleSlimsteMensStarted, toggleSlimsteMensTimer
} from './pages/api/db/db'
import * as http from 'http'
import * as socketio from 'socket.io';
import { correctAnswer, startTimer, stopTimer } from './models/GameLogic'

const dev: boolean = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port: number = parseInt(process.env.PORT, 10) || 3000;

nextApp.prepare().then(async() => {
  const app: Express = express();
  const server: http.Server = http.createServer(app);
  const io = new socketio.Server({
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });

  io.attach(server);

  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
  });
  io.on('connection', socket => {
    socket.on('newQ', (data) => {
          createQuestion(data.round, data.question, data.answer).then(() => {
            socket.emit('db', { succeed: true });
            getQuestions().then(e => {
              socket.emit('?newTable', {question: e})
            })
          }).catch((e) => {
            socket.emit('db', { succeed: false, error: e });
          });
      })
    socket.on('?getQ', () => {
      getQuestions().then(e => {
        socket.emit('?newTable', {question: e})
      })
    })
    socket.on('?toggleGame', () => {
      toggleSlimsteMensStarted().then(() => {
        getCurrentGame().then(e => {
          io.sockets.emit('?currentGame', {response: e});
        })
      })
    })
    socket.on('?getCurrGame', () => {
      getCurrentGame().then(e => {
        io.sockets.emit('?currentGame', {response: e});
      })
    })
    socket.on('?getU', () => {
      getUsers().then(e => {
        socket.emit('?newUsers', {users: e});
      })
    })
    socket.on('?newUser', (data) => {
      createUser(data.username, data.password1, data.password2, data.role).then(() => {
        getUsers().then(e => {
          socket.emit('?newUsers', {users: e});
        })
      })
    })
    socket.on('?correctAns', async (data) => {
      console.log(data)
      if(data.round != 3) {
        setCorrectAnswer(data.index).then(() => {
          if(data.round !== 1 || (data.round === 1 && [3,6,9].indexOf(data.round1) != -1)) {
            correctAnswer(data.round, data.index, data.username).then(() => {
              getCurrentGame().then(e => {
                io.sockets.emit('?currentGame', { response: e });
              })
            })
          }else{
            getCurrentGame().then(e => {
              io.sockets.emit('?currentGame', { response: e });
            })
          }
        })
      }else{
        console.log(data)
        for(const i in data.index){
          await setCorrectAnswer(data.index[i])
        }
        correctAnswer(data.round, data.index[0], data.username).then(() => {
          getCurrentGame().then(e => {
            io.sockets.emit('?currentGame', { response: e });
          })
        })
      }
    })
    socket.on("?nextRound", () => {
      nextRound().then(() => {
        getCurrentGame().then(e => {
          io.sockets.emit('?currentGame', {response: e});
        })
      })
    })
    socket.on("?showQuestion", () => {
      toggleShowQuestion().then(() => {
        getCurrentGame().then(e => {
          io.sockets.emit('?currentGame', {response: e});
        })
      })
    })
    socket.on("?nextUser", () => {
      nextUser().then(() => {
        getCurrentGame().then(e => {
          io.sockets.emit('?currentGame', {response: e});
        })
      })
    })
    socket.on("?nextQuestion", (data) => {
      nextQuestion(data.round).then(() => {
        getCurrentGame().then(e => {
          io.sockets.emit('?currentGame', {response: e});
        })
      })
    })
    socket.on('?toggleTimer',  (data) => {
      toggleSlimsteMensTimer().then( val => {
        if(val) {
          startTimer(data.username, data.round, io)
          getCurrentGame().then(e => {
            io.sockets.emit('?currentGame', {response: e});
          })
        }else{
          stopTimer(data.username, data.round).then(() => {
            getCurrentGame().then(e => {
              io.sockets.emit('?currentGame', {response: e});
            })
          })
        }
      })
    })

  })
  app.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });
})
