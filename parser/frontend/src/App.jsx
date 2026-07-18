import "./App.css";

function App() {
  const route = {
    warehouse: "WAXIE Livermore",
    routeNumber: "16W07",
  };

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
        <p>The loader interface will live here.</p>
      </section>
    </main>
  );
}

export default App;