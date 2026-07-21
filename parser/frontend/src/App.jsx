import { useRef, useState } from "react";
import "./App.css";

function App() {
  const fileInputRef = useRef(null);

  const [route, setRoute] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("NOTHING HERE YET");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(file) {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus("PLEASE SELECT A PDF FILE");
      return;
    }

    setSelectedFile(file);
    setRoute(null);
    setStatus(`${file.name} READY`);
  }

  function handleFileInput(event) {
    selectFile(event.target.files?.[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    selectFile(event.dataTransfer.files?.[0]);
  }

  async function handleConversion() {
    if (!selectedFile || isLoading) return;

    setIsLoading(true);
    setStatus(`CONVERTING ${selectedFile.name}`);

    const formData = new FormData();
    formData.append("pdf", selectedFile);

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
      setStatus("DOCUMENT CONVERSION COMPLETE");
    } catch (error) {
      console.error(error);
      setStatus(`CONVERSION FAILED: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setSelectedFile(null);
    setRoute(null);
    setStatus("NOTHING HERE YET");
    setIsLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <main className={`app ${isLoading ? "is-loading" : ""}`}>
      <div className="background-icons" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className={`background-icon icon-${(index % 6) + 1}`}
          />
        ))}
      </div>

      <div className="app-shell">
        <header className="brand-header">
          <img
             className="brand-logo"
             src="/assets/liteload-logo.svg"
             alt="LiteLoad"
          />

          <div className="brand-copy">
            <div className="wordmark">
              <span>LITE-</span>
              <span>LOAD</span>
            </div>

            <p>LET’S STACK THIS PAPER</p>
          </div>
        </header>

        <div className="header-rule" />

        <section
          className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
          />

          <img
            className="truck-illustration"
            src="/assets/liteload-truck.png"
            alt=""
          />

          <h1>DRAG AND DROP FILES HERE</h1>
          <p>LEGACY .PDF FILE FORMAT</p>
        </section>

        <section
          className="conversion-panel"
          aria-live="polite"
          aria-busy={isLoading}
        >
          <div className="conversion-content">
            {!route ? (
              <p className="empty-state">{status}</p>
            ) : (
              <pre>{JSON.stringify(route, null, 2)}</pre>
            )}
          </div>

          <div className="fake-scrollbar" aria-hidden="true">
            <span />
          </div>
        </section>

        <div className="action-row">
          <button
            className="action-button"
            type="button"
            disabled={!selectedFile || isLoading}
            onClick={handleConversion}
          >
            {isLoading
              ? "Converting Document..."
              : "Begin Document Conversion"}
          </button>

          <button
            className="action-button"
            type="button"
            disabled={isLoading && !selectedFile}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;