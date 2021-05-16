import { addSeconds, getSeconds, setSeconds } from '../pages/api/db/db'
import { Socket } from 'socket.io'
// 3-6-9, open deur, puzzel, Collectief geheugen, Finale

let timer = undefined;
let lastSecond = 0;
const RoundPoints = [0, 20, 20, 30, 10]

export function correctAnswer(round: number, index: number, username: string): Promise<any>{
  if(round != 4){
    return addSeconds(username, RoundPoints[round]).then(() => {
      return new Promise(resolve => {
        resolve(true)
      })
    });
  }else{
    return addSeconds(username, (index + 1) * RoundPoints[round]).then(() => {
      return new Promise(resolve => {
        resolve(true)
      })
    })
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function startTimer(username: string, round: number, socket: any): void{
  if(round != 1){
    getSeconds(username).then(amount => {
      lastSecond = amount.time
      timer = Timer(amount.time, function(){
      }, socket, username)
      socket.sockets.emit("?newTime", { username: username, time: lastSecond});
      console.log(timer);
    })
  }
}

export async function stopTimer(username: string, round: number): Promise<boolean> {
  if (round != 1) {
    timer.pause();
    return setSeconds(username, Math.ceil(timer.amount / 1000)).then(() => {
      return true;
    })
  }
  return false;
}

function sendTimeUpdate(time: number, username: string, socket: any){
  if(Math.ceil(time / 1000) < lastSecond) {
    lastSecond = Math.ceil(time / 1000)
    socket.sockets.emit("?newTime", { username: username, time: lastSecond});
  }
}

function Timer(seconds: number, oncomplete: () => void, socket: any, username: string) {
  let startTime, timer, ms = seconds*1000;
  const obj = {resume: undefined, pause: undefined, step: undefined, amount: seconds};
  obj.resume = function() {
    startTime = new Date().getTime();
    timer = setInterval(obj.step,250); // adjust this number to affect granularity
    // lower numbers are more accurate, but more CPU-expensive
  };
  obj.pause = function() {
    ms = obj.step();
    clearInterval(timer);
  };
  obj.step = function() {
    const now = Math.max(0,ms-(new Date().getTime()-startTime));
    obj.amount = now;
    sendTimeUpdate(now, username, socket);
    if( now == 0) {
      clearInterval(timer);
      obj.resume = function() {};
      if( oncomplete) oncomplete();
    }
    return now;
  };
  obj.resume();
  return obj;
}