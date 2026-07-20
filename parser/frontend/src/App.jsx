import { useState } from "react";
import "./App.css";

function App() {
  const [route, setRoute] = useState({
    warehouse: "WAXIE Livermore",
    routeNumber: "16W07",
  });

  const [status, setStatus] = useState("Choose a PDF to begin.");

  async function handleFileUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    setStatus(`Sending ${file.name} to the server...`);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:3001/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const parsedRoute = await response.json();

      console.log("Parser response:", parsedRoute);
      setRoute(parsedRoute);
      setStatus("PDF parsed successfully.");
    } catch (error) {
      console.error(error);
      setStatus(`Something went wrong: ${error.message}`);
    }
  }

  return (
    <main className="app">
      <header className="route-header">
        <div>
          <p className="eyebrow">LiteLoad</p>
          <h1>{route.routeNumber}</h1>
        </div>

        <p className="warehouse">{route.warehouse}</p>
      </header>

      <section className="route-content">
        <h2>Route Overview</h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
        />

        <p>{status}</p>

       {route && (
          <pre>{JSON.stringify(route, null, 2)}</pre>
       )}
      </section>
    </main>
  );
}

export default App;