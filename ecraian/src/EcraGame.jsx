
import { useState } from "react";

const rounds = [
  {
    title: "Round 1: The tennis challenge 🎾",
    question: "What's more likely to happen on our first meeting?",
    options: [
      {
        text: "Ecra challenges me to tennis 😂",
        reply: "Obviously! I can't let you think I'm all talk. 🎾",
      },
      {
        text: "We end up talking for hours ❤️",
        reply: "Okay, this answer is actually adorable. 🥹",
      },
    ],
  },
  {
    title: "Round 2: Get to know Ecra 💗",
    question: "What makes Ecra different?",
    options: [
      {
        text: "She built me a whole website 😭",
        reply: "Guilty! My developer brain had to do something extra. 👩🏽‍💻",
      },
      {
        text: "She's creative and loves trying new things ✨",
        reply: "You get it! I'm always looking for a new adventure. ❤️",
      },
    ],
  },
  {
    title: "Final round: The plot twist 💌",
    question: "What should happen after this application?",
    options: [
      {
        text: "We meet and see if we connect 😊",
        reply: "That's exactly what I'd love. No pressure, just a real chance.",
      },
      {
        text: "I need to know more about this girl 👀",
        reply: "Then the application has done its job. Come say hi! 😂❤️",
      },
    ],
  },
];

function EcraGame({ onFinish }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState(null);
  const [finished, setFinished] = useState(false);

  const round = rounds[roundIndex];

  function chooseOption(option) {
    setChosenOption(option);
  }

  function nextRound() {
    if (roundIndex === rounds.length - 1) {
      setFinished(true);
      return;
    }

    setRoundIndex((current) => current + 1);
    setChosenOption(null);
  }

  if (finished) {
    return (
      <section className="ecra-game">
        <div className="game-confetti" aria-hidden="true">
          💗 ✨ 💘 🎾 ❤️
        </div>

        <p className="game-eyebrow">YOU MADE IT! 🎉</p>

        <h2>You survived the Ecra experience! 😂❤️</h2>

        <p>
          Now you know a little about the girl from Thika.
          The real adventure would be getting to know each other
          beyond this screen.
        </p>

        <p className="game-final-line">
          So, Ian... should we turn this plot twist into a real meeting? 💌
        </p>

        <button type="button" onClick={onFinish}>
          Back to my application ❤️
        </button>
      </section>
    );
  }

  return (
    <section className="ecra-game">
      <p className="game-eyebrow">
        A LITTLE CHALLENGE FOR IAN 💌
      </p>

      <div className="game-progress">
        {rounds.map((item, index) => (
          <span
            key={item.title}
            className={index <= roundIndex ? "progress-dot active" : "progress-dot"}
            aria-label={`Round ${index + 1}`}
          />
        ))}
      </div>

      <p className="game-round">
        ROUND {roundIndex + 1} OF {rounds.length}
      </p>

      <h2>{round.title}</h2>
      <p>{round.question}</p>

      <div className="game-options">
        {round.options.map((option) => (
          <button
            type="button"
            key={option.text}
            className={
              chosenOption?.text === option.text
                ? "game-option chosen"
                : "game-option"
            }
            onClick={() => chooseOption(option)}
          >
            {option.text}
          </button>
        ))}
      </div>

      {chosenOption && (
        <div className="game-reaction" role="status">
          <p>{chosenOption.reply}</p>

          <button type="button" onClick={nextRound}>
            {roundIndex === rounds.length - 1
              ? "Reveal the plot twist 💌"
              : "Next challenge →"}
          </button>
        </div>
      )}
    </section>
  );
}

export default EcraGame;
