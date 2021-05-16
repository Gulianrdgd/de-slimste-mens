import Question from './Question'

interface Prop{
  answers: string[],
  correct: boolean[],
  className?: string
}

interface PropInner{
  text: string,
  correct: boolean,
  color: string
}
interface ans {
  value: string,
  correct: boolean,
  color: string
}

function shuffle(array: ans[]) {
  array.splice(0, 1)
  array.splice(3, 1)
  array.splice(6, 1)
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function Box(prop: PropInner): JSX.Element{
  return (
    <div className={prop.correct ? "flex rounded w-48 h-24 m-2 items-center flex-wrap justify-center bg-" + prop.color + "-500" : "flex rounded bg-dsm w-48 h-24 m-2 items-center flex-wrap justify-center"}>
      <h1 className={"text-center text-white text-xl self-center"}>{prop.text}</h1>
    </div>
  )
}

function CorrectAns(prop: Prop): JSX.Element{
  const temp = []
    const tmp = [];
    tmp.push(prop.answers[0]);
    tmp.push(prop.answers[4]);
    tmp.push(prop.answers[8]);

    for(const ans in prop.answers) {
      if (tmp.indexOf(prop.answers[ans]) != -1) {
        if (prop.correct[ans]) {
          temp.push(
            <Question text={prop.answers[ans]} disabled={false}
                      username={"None"} round={3} index={parseInt(ans)}
                      isAdmin={false} className={"m-0"}/>
          );
        } else {
          temp.push(
            <Question text={prop.answers[ans]} disabled={true}
                      username={"None"} round={3} index={parseInt(ans)}
                      className={"grayScale -mb-10"} isAdmin={false} />
          );
        }
      }}
  return (<div>{temp}</div>)
}

function Round3(prop: Prop):JSX.Element{
  const colors = ["red", "red", "red", "red", "blue", "blue", "blue", "blue", "green", "green", "green", "green"];
  const newArr = [...prop.answers].map(function(e, i) {
    return {value: e, correct: prop.correct[i], color: colors[i]};
  });
  const shuffledAns = shuffle([...newArr]);
  return (
    <div>
      { prop.answers && prop.correct && <>
        <div className={"flex flex-col justify-center justify-self-center content-center " + prop.className}>
          <div className={"flex flex-row justify-center content-center"}>
            <Box text={shuffledAns[0].value} correct={shuffledAns[0].correct} color={shuffledAns[0].color} />
            <Box text={shuffledAns[1].value} correct={shuffledAns[1].correct} color={shuffledAns[1].color} />
            <Box text={shuffledAns[2].value} correct={shuffledAns[2].correct} color={shuffledAns[2].color} />
          </div>
          <div className={"flex flex-row justify-center content-center"}>
            <Box text={shuffledAns[3].value} correct={shuffledAns[3].correct} color={shuffledAns[3].color} />
            <Box text={shuffledAns[4].value} correct={shuffledAns[4].correct} color={shuffledAns[4].color} />
            <Box text={shuffledAns[5].value} correct={shuffledAns[5].correct} color={shuffledAns[5].color} />
          </div>
          <div className={"flex flex-row justify-center content-center"}>
            <Box text={shuffledAns[6].value} correct={shuffledAns[6].correct} color={shuffledAns[6].color} />
            <Box text={shuffledAns[7].value} correct={shuffledAns[7].correct} color={shuffledAns[7].color} />
            <Box text={shuffledAns[8].value} correct={shuffledAns[8].correct} color={shuffledAns[8].color} />
          </div>
        </div>
        <CorrectAns answers={[...prop.answers]} correct={[...prop.correct]}/>
      </>
      }
    </div>
  )
}

export default Round3;