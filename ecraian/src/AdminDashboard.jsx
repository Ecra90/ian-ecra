
import { useCallback, useEffect, useState } from "react";

const API = "https://ian-ecra-backend.vercel.app/api";

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("ecra");
  const [password, setPassword] = useState("");
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const loadResponses = useCallback(async () => {
    setError("");
    setRefreshing(true);

    try {
      const response = await fetch(`${API}/responses`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        setLoggedIn(false);
        setResponses([]);
        throw new Error("Your session expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Server error: HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Flask returned an unexpected response format.");
      }

      setResponses(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Refresh failed:", err);
      setError(err.message || "Cannot connect to Flask.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch(`${API}/session`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Session check failed: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (cancelled) return;

        if (data.logged_in) {
          setLoggedIn(true);
          await loadResponses();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Cannot connect to Flask.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [loadResponses]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Login failed: HTTP ${response.status}`);
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
        throw new Error(`Logout failed: HTTP ${response.status}`);
      }

      setLoggedIn(false);
      setResponses([]);
      setLastUpdated("");
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

        {lastUpdated && (
          <p>Last refreshed: {lastUpdated}</p>
        )}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {!error && responses.length === 0 && (
          <p>No responses have been submitted yet.</p>
        )}

        {responses.length > 0 && (
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


