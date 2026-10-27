
import { useState } from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [showMessage, setShowMessage] = useState(false);
  const [showConfession, setShowConfession] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const hearts = ["❤️", "💕", "💗", "💖", "💘", "♥️"];


  async function submitAnswer() {
    if (!answer || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answer }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save your answer.");
      }

      setAnswer(data.status === "success" ? answer : "");
      alert("Your answer has been saved! ❤️");
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }
  if (window.location.pathname === "/admin") {
  return <AdminDashboard />;
}

  return (
    <div className="container">
      {/* Floating hearts background */}
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

      <h1>Ian, Hear Me Out ❤️</h1>

      <p>Hey Ian! I have something to tell you.</p>

      {!showMessage && (
        <button onClick={() => setShowMessage(true)}>
          Okay, I'm listening 👀
        </button>
      )}

      {showMessage && (
        <div className="message">
          <h2>First of all... 😂</h2>

          <p>
            You don't know me that well yet, but here I am,
            building a whole website just to get your attention.
          </p>

          <p>
            At this point, you have to respect the creativity. 😌
          </p>

          {!showConfession && (
            <button onClick={() => setShowConfession(true)}>
              Okay, tell me the real reason 👀
            </button>
          )}
        </div>
      )}

      {showConfession && (
        <div className="confession">
          <h2>Here's the plot twist... 💌</h2>

          <p>
            Ian, I think you're cute, and I'd love the chance
            to get to know you better.
          </p>

          <p>
            So, I'm shooting my shot. No pressure, just good
            vibes and a little courage. ❤️
          </p>

          <h3>So, Ian... what do you say?</h3>

          <div className="choices">
            <button onClick={() => setAnswer("yes")}>
              Let's get to know each other 😊
            </button>

            <button onClick={() => setAnswer("maybe")}>
              Let me think about it 😅
            </button>

            <button
              onClick={submitAnswer}
              disabled={!answer || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send my answer ❤️"}
            </button>

            {error && <p className="error">{error}</p>}

          </div>

          {answer === "yes" && (
            <p className="response">
              Wait... IS THIS REALLY HAPPENING?! 😭❤️
              I promise to make our first conversation worth it!
            </p>
          )}

          {answer === "maybe" && (
            <p className="response">
              Fair enough 😂 Take your time. I'll give you
              space to think about it. ❤️
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;




