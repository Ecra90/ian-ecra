


import { useState } from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import EcraGame from "./EcraGame";

// Set REACT_APP_API_URL in .env if Flask is deployed separately.
// Otherwise, this defaults to the same domain as the frontend.
const API = (
  process.env.REACT_APP_API_URL || "/api"
).replace(/\/+$/, "");

function App() {
  const [showMessage, setShowMessage] = useState(false);
  const [showConfession, setShowConfession] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showGame, setShowGame] = useState(false);

  const hearts = ["❤️", "💕", "💗", "💖", "💘", "♥️"];

  async function submitAnswer() {
    if (!answer || isSubmitting || submitted) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || `Could not save your answer (HTTP ${response.status}).`
        );
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <main className="container">
      <div className="hearts" aria-hidden="true">
        {hearts.map((heart, index) => (
          <span
            key={index}
            style={{
              left: `${10 + index * 15}%`,
              animationDelay: `${index * 0.7}s`,
            }}
          >
            {heart}
          </span>
        ))}
      </div>

      <div className="love-card">
        <p className="eyebrow">Officially applying for Ian 💌</p>

        <h1>Ian, This Is Not Your Usual DM ❤️</h1>

        <p className="intro">
          You said we could apply through DM or TikTok.
          I chose a third option: building you a whole website.
          Yes, I'm serious. 😂👩🏽‍💻
        </p>

        {!showMessage && (
          <button type="button" onClick={() => setShowMessage(true)}>
            Open my application 👀
          </button>
        )}

        {showMessage && !showConfession && (
          <section className="message">
            <h2>Because why be ordinary? 😂❤️</h2>

            <p>
              I'm a developer. I could have sent you a simple DM,
              but where's the fun in that when I can turn my
              application into an actual project? 😭
            </p>

            <p>
              This website is my way of saying, "Hey Ian,
              here's a little creativity, a little courage,
              and a girl who's willing to shoot her shot."
            </p>

            <p>
              No copy-and-paste application. Just me,
              putting myself out there and hoping you'll
              want to know more.
            </p>

            <h3>Ready to meet the girl behind the code? 👀</h3>

            <button
              type="button"
              onClick={() => setShowConfession(true)}
            >
              Meet Ecra ❤️
            </button>
          </section>
        )}

        {showConfession && !submitted && (
          <section className="confession">
            <h2>Hi Ian, it's actually me! 🥹❤️</h2>

            <p>
              My name is Ecra, I'm 19 years old, and I'm based in Thika,
              around the wider Nairobi area. ❤️✨
            </p>

            <div className="ecra-profile">
              <img
                src="/images/ecra.smile.jpg"
                alt="Ecra smiling outdoors"
                className="ecra-main-photo"
              />

              <h3>The girl behind the website 💗</h3>

              <p>
                A curvy girl with big dreams, a smile, and the
                courage to build a whole website just to shoot
                her shot. 😂❤️
              </p>

              <div className="ecra-gallery">
                <figure>
                  <img
                    src="/images/ecra.sporty.jpg"
                    alt="Ecra showing her sporty side"
                  />
                  <figcaption>My sporty side 🎾</figcaption>
                </figure>

                <figure>
                  <img
                    src="/images/ecra.smile2.jpg"
                    alt="Ecra showing another side of her personality"
                  />
                  <figcaption>Just being me ✨</figcaption>
                </figure>
              </div>
            </div>

            <h3>A little about my personality ✨</h3>

            <p>
              I'm creative, expressive, and willing to try
              something different when I really want something.
              Exhibit A: this entire website. 😂❤️
            </p>

            <p>
              I enjoy meeting people, telling stories through
              interviews, and exploring opportunities that
              challenge me to grow.
            </p>

            <h3>More than just a pretty face 👀</h3>

            <p>
              I'm a content creator who enjoys interviews,
              an aspiring actress, a tennis player, and a developer.
              Basically, I have interests beyond building websites. 😂🎾
            </p>

            <h3>Camera-ready? Let's go! 🎥</h3>

            <p>
              I'm comfortable being featured on your YouTube
              channel, and I'd be happy to participate in the
              filming and content experience.
            </p>

            <p>
              And honestly, Ian? I think you're cute. 😭❤️
              I'd genuinely love the chance to meet you,
              have a good conversation, and see if we connect.
            </p>

            <p>
              I could have sent you a DM, but I wanted you
              to see a little of my creativity and personality
              before we even meet.
            </p>

            <h3>
              So, Ian... will you give the girl from Thika a chance? 💌
            </h3>

            <div className="choices">
              <button
                type="button"
                className={answer === "yes" ? "selected" : ""}
                onClick={() => {
                  setAnswer("yes");
                  setError("");
                }}
                disabled={isSubmitting}
              >
                Let's get to know each other 😊
              </button>

              <button
                type="button"
                className={answer === "maybe" ? "selected" : ""}
                onClick={() => {
                  setAnswer("maybe");
                  setError("");
                }}
                disabled={isSubmitting}
              >
                Let me think about it 😅
              </button>

              <button
                type="button"
                className="submit-button"
                onClick={submitAnswer}
                disabled={!answer || isSubmitting || submitted}
              >
                {isSubmitting ? "Sending..." : "Send my answer ❤️"}
              </button>
            </div>

            {answer === "yes" && (
              <p className="response">
                WAIT... 😭❤️ The girl who built you a website
                might actually get to meet you!
                I'm ready for good vibes and a great conversation.
              </p>
            )}

            {answer === "maybe" && (
              <p className="response">
                Fair enough 😂❤️ Take your time.
                No pressure — I appreciate your honesty.
              </p>
            )}

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
          </section>
        )}

        {!showGame ? (
          <div className="game-invitation">
            <h3>Think you can handle me, Ian? 👀❤️</h3>
            <p>
              I've prepared three little challenges.
              Let's see if you can survive the Ecra experience. 😂
            </p>

            <button type="button" onClick={() => setShowGame(true)}>
              Accept the challenge 🎮
            </button>
          </div>
        ) : (
          <EcraGame onFinish={() => setShowGame(false)} />
        )}

        {submitted && (
          <section className="success-message" role="status">
            <h2>Response received! 💌</h2>

            <p>
              Thank you for taking the time to consider
              my application, Ian. Whatever your answer,
              I'm glad I had the courage to shoot my shot. ❤️
            </p>

            <p>— Ecra, the girl from Thika ✨</p>
          </section>
        )}

        <footer className="page-footer">
          Built with code, courage, and a little crush. 😂❤️
        </footer>
      </div>
    </main>
  );
}

export default App;
