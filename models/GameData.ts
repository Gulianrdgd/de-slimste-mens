import question from './Question'
import user from './Users'

type gameData = {
  round: number,
  current_question: question,
  current_player: string,
  has_started: boolean,
  timer_started: boolean,
  current_answered: boolean[],
  players: user[],
  show_question: user,
  round1: number
};

export default gameData;