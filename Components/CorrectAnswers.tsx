import Question from './Question'
import { Socket } from 'socket.io-client'
import gameData from '../models/GameData'

interface Props{
  gameData: gameData,
  socket: Socket,
  isAdmin: boolean
}

function CorrectAnswers(prop: Props) : JSX.Element {

  function sendCorrectAnswer(index: number, round: number, username: string): void{
    console.log(prop.gameData, round, index)
    if(round === 3){
      switch (index){
        case 0:
          prop.socket.emit('?correctAns', { index: [0,1,2,3], round: round, username: username });
          break;
        case 4:
          prop.socket.emit('?correctAns', { index: [4,5,6,7], round: round, username: username });
          break;
        case 8:
          prop.socket.emit('?correctAns', { index: [8,9,10,11], round: round, username: username });
          break;
      }
    }else if(round === 1) {
      prop.socket.emit('?correctAns', { index: index, round: round, username: username, round1: prop.gameData.round1});
    } else {
      prop.socket.emit('?correctAns', { index: index, round: round, username: username });
    }
  }

  function DisplayAnswers() : JSX.Element{
    const temp = [];
    if(prop.gameData.round === 3){
      const tmp = [];
      tmp.push(prop.gameData.current_question.answers[0]);
      tmp.push(prop.gameData.current_question.answers[4]);
      tmp.push(prop.gameData.current_question.answers[8]);

      for(const ans in prop.gameData.current_question.answers) {
        if (tmp.indexOf(prop.gameData.current_question.answers[ans]) != -1) {
          if (prop.gameData.current_answered[ans]) {
            temp.push(
              <Question text={prop.gameData.current_question.answers[ans]} disabled={false}
                        username={prop.gameData.current_player} round={prop.gameData.round} index={parseInt(ans)}
                        onClick={sendCorrectAnswer}  isAdmin={prop.isAdmin}/>
            );
          } else {
            temp.push(
              <Question text={prop.gameData.current_question.answers[ans]} disabled={true}
                        username={prop.gameData.current_player} round={prop.gameData.round} index={parseInt(ans)}
                        onClick={sendCorrectAnswer} className={"grayScale"} isAdmin={prop.isAdmin}/>
            );
          }
        }
      }
    } else {
      for (const ans in prop.gameData.current_question.answers) {
        if (prop.gameData.current_answered[ans]) {
          temp.push(
            <Question text={prop.gameData.current_question.answers[ans]} disabled={false}
                      username={prop.gameData.current_player} round={prop.gameData.round} index={parseInt(ans)}
                      onClick={sendCorrectAnswer} className={"noselect"} isAdmin={prop.isAdmin} />
          );
        } else {
          temp.push(
            <Question text={prop.gameData.current_question.answers[ans]} disabled={true}
                      onClick={sendCorrectAnswer} className={"grayScale noselect"} username={prop.gameData.current_player} round={prop.gameData.round} index={parseInt(ans)} isAdmin={prop.isAdmin} />
          );
        }
      }
    }

    return (<div>{temp}</div>);
  }

  return (
    <div className={"flex flex-col justify-center "}>
          <h1 className={"mt-10 text-white text-center text-3xl self-center"}>Question: {prop.gameData.current_question.question}</h1>
          <DisplayAnswers/>
    </div>
  );
}

export default CorrectAnswers;