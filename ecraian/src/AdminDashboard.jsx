
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("ecra");
  const [password, setPassword] = useState("");
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadResponses() {
    setError("");
    setRefreshing(true);

    try {
      const response = await fetch(`${API}/responses`, {
        credentials: "include",
      });

      if (response.status === 401) {
        setLoggedIn(false);
        setResponses([]);
        setError("Your session has expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load responses. Please try again.");
      }

      const data = await response.json();

      // Supports either a direct array or { responses: [...] }.
      const items = Array.isArray(data) ? data : data.responses;

      if (!Array.isArray(items)) {
        throw new Error("Unexpected response format from Flask.");
      }

      setResponses(items);
    } catch (err) {
      setError(err.message || "Cannot connect to the backend.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${API}/session`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Could not verify your login session.");
        }

        const data = await response.json();

        if (data.logged_in) {
          setLoggedIn(true);
          await loadResponses();
        }
      } catch (err) {
        setError(err.message || "Cannot connect to Flask. Is it running?");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      setPassword("");
      setLoggedIn(true);
      await loadResponses();
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  }

  async function handleLogout() {
    setError("");

    try {
      const response = await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Could not log out. Please try again.");
      }

      setLoggedIn(false);
      setResponses([]);
    } catch (err) {
      setError(err.message || "Logout failed.");
    }
  }

  if (loading) {
    return <main className="admin-page">Loading dashboard...</main>;
  }

  if (!loggedIn) {
    return (
      <main className="admin-page">
        <form className="admin-card" onSubmit={handleLogin}>
          <h1>Welcome back, Ecra 💗</h1>
          <p>Log in to view submitted responses.</p>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Log in 🔐</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-card">
        <h1>Your Response Dashboard 💌</h1>
        <p>Total responses: {responses.length}</p>

        <button
          type="button"
          onClick={loadResponses}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh responses ↻"}
        </button>

        {" "}

        <button type="button" onClick={handleLogout}>
          Log out
        </button>

        {error && <p className="error">{error}</p>}

        {responses.length === 0 ? (
          <p>No responses have been submitted yet.</p>
        ) : (
          <div className="response-list">
            {responses.map((item) => (
              <article className="response-item" key={item.id}>
                <h3>
                  {item.answer === "yes"
                    ? "❤️ Wants to get to know you"
                    : "💭 Wants time to think"}
                </h3>

                <p>Response #{item.id}</p>

                <small>
                  {new Date(item.created_at).toLocaleString()}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;

