import express, { Express, Request, Response } from 'express'
import next from "next";
import { getSession } from 'next-auth/client'
import { createQuestion, getQuestions } from './pages/api/db/db'
import * as http from 'http'
import * as socketio from 'socket.io';

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
    console.log("Connected");
    socket.on('newQ', (data) => {
          console.log(data);
          createQuestion(data.round, data.question, data.answer).then(() => {
            socket.emit('db', { succeed: true });
            getQuestions().then(e => {
              socket.emit('?newTable', {question: e})
            })
          }).catch((e) => {
            console.log("[DB ERROR]: ", e);
            socket.emit('db', { succeed: false, error: e });
          });
      })
    socket.on('getQ', () => {
      getQuestions().then(e => {
        socket.emit('?newTable', {question: e})
      })
    })
  })
  app.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });
})
