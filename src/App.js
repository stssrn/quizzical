import React, {useState, useRef, useCallback} from "react"
import Question from "./Question"

export default function App() {
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizData, setQuizData] = useState({});
    const [isCorrectArray, setIsCorrectArray] = useState([]);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    const main = useRef();
    const launchScreen = useRef();
    const leftBlob = useRef();
    const rightBlob = useRef();

    const updateQuestions = useCallback(() => {
        (async () => {
            const res = await fetch("https://opentdb.com/api.php?amount=10");
            const data = await res.json();
            setQuizData(data);
        })();
    }, []);

    const startQuiz = () => {
        updateQuestions();
        launchScreen.current.classList.add("launch-screen-animation");
        leftBlob.current.classList.add("left-blob-animation");
        rightBlob.current.classList.add("right-blob-animation");
        setTimeout(() => {
            setQuizStarted(prevQuizStarted => !prevQuizStarted);
            main.current.classList.add("allow-overlow");
        }, 1000);
    };

    const checkAnswers = () => {
        if (showCorrectAnswers) {
            updateQuestions();
            setIsCorrectArray([]);
            setShowCorrectAnswers(false);
        } else {
            const correctCount = isCorrectArray.reduce((acc, x) => x ? acc + 1 : acc, 0);
            setCorrectAnswersCount(correctCount);
            setShowCorrectAnswers(true);
        }
    }

    const questionElements = quizData.results?.map((question, key) => (
        <Question
            key={key} 
            id={key} 
            setIsCorrectArray={setIsCorrectArray}
            showCorrectAnswers={showCorrectAnswers}
            {...question} 
            />
        ))

    return (
        <main ref={main}>
            {!quizStarted &&
            <section ref={launchScreen} className="launch-screen">
                <div className="centered-container">
                    <h1>Quizzical</h1>
                    <p>Scrimba "Learn React for free" module 4 solo project</p>
                    <button
                        type="button"
                        className="main-button"
                        onClick={startQuiz}
                    >
                        Start quiz
                    </button>
                </div>
            </section>
            }

            {quizStarted &&
            <section className="questions">
                <form>
                    {questionElements}
                    <div className="questions__answers-box">
                        {showCorrectAnswers &&
                        <p className="questions__score">You scored {correctAnswersCount} / {questionElements.length} correct answers</p>
                        }
                        <button
                            type="button" 
                            className="main-button" 
                            onClick={checkAnswers}
                        >
                            {showCorrectAnswers ? "Play again" : "Check answers"}
                        </button>
                    </div>
                </form>
            </section>
            }

            <svg ref={leftBlob} className="left-blob" viewBox="0 0 297 235">
                <path fillRule="evenodd" clipRule="evenodd" d="M143.448 4.90596C184.961 1.77498 231.243 -9.72149 261.306 19.1094C294.581 51.0203 304.282 102.703 291.701 147.081C279.767 189.18 242.745 220.092 200.821 232.476C165.528 242.902 133.567 218.605 99.8993 203.738C63.6625 187.737 15.3588 182.993 3.25932 145.239C-9.35799 105.868 16.7305 64.5881 45.9358 35.3528C71.2672 9.99541 107.727 7.60006 143.448 4.90596Z" fill="#DEEBF8"/>
            </svg>
            <svg ref={rightBlob} className="right-blob" viewBox="0 0 369 366">
            <path fillRule="evenodd" clipRule="evenodd" d="M99.4095 250.395C71.1213 219.851 33.3179 190.782 37.1727 149.307C41.4394 103.401 75.854 63.6412 118.419 45.8671C158.797 29.0063 206.035 38.7442 241.822 63.8506C271.947 84.9859 272.823 125.124 282.141 160.729C292.17 199.051 318.521 239.811 296.501 272.779C273.539 307.159 224.991 312.432 183.931 307.768C148.318 303.723 123.751 276.677 99.4095 250.395Z" fill="#FFFAD1"/>
            </svg>
        </main>
    )
}