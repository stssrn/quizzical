import React, {useEffect, useState} from "react"

const shuffleArray = (array) => array.sort((a,b) => 0.5 - Math.random());

const decodeHtml = (html) => {
    let text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
};

export default function Question({incorrect_answers, correct_answer, ...props}) {
    const [answers, setAnswers] = useState(shuffleArray([...incorrect_answers, correct_answer]));
    const [selectedAnswer, setSelectedAnswer] = useState("");

    useEffect(() => {
        setAnswers(shuffleArray([...incorrect_answers, correct_answer]))
    }, [incorrect_answers, correct_answer])

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedAnswer(value);
        props.setIsCorrectArray(oldIsCorrectArray => {
            const array = oldIsCorrectArray;
            array[props.id] = value === correct_answer;
            return array;
            })
    };

    const answerElements = answers.map((answer, key) => (
            <div key={key}>
            <input 
                type="radio"
                className={
                    props.showCorrectAnswers && answer === correct_answer ?
                    "correct" :
                    "incorrect"
                }
                disabled={props.showCorrectAnswers}
                id={answer.toLowerCase() + props.id}
                name={props.question}
                value={answer}
                checked={answer === selectedAnswer}
                onChange={handleChange}>
            </input>
            <label htmlFor={answer.toLowerCase() + props.id}>{decodeHtml(answer)}</label>
            </div>
        ));

    return (
        <fieldset className="question">
            <legend className="question__text">{decodeHtml(props.question)}</legend>
            <div className="question__answers">
                {answerElements}
            </div>
        </fieldset>
    )
}