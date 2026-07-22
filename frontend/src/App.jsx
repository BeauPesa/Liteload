import { useRef, useState } from "react";
import "./App.css";

const MAX_FILES = 3;

function extractRouteNumber(filename) {
  const baseName = filename.replace(/\.[^/.]+$/, "").toUpperCase();
  const routeMatch = baseName.match(
    /(?:\bROUTE[\s_-]*)?\b([0-9]{1,3}[A-Z][0-9]{1,3})\b/
  );

  return routeMatch?.[1] ?? "ROUTE";
}

function App() {
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState("NOTHING HERE YET");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function makeFileItem(file, index) {
    return {
      id: `${file.name}-${file.lastModified}-${index}`,
      file,
      routeNumber: extractRouteNumber(file.name),
      progress: 0,
      state: "ready",
      parsedRoute: null,
      error: null,
    };
  }

  function selectFiles(incomingFiles) {
    const pdfFiles = Array.from(incomingFiles || [])
      .filter((file) => file.type === "application/pdf")
      .slice(0, MAX_FILES);

    if (!pdfFiles.length) {
      setStatus("PLEASE SELECT PDF FILES");
      return;
    }

    setSelectedFiles(pdfFiles.map(makeFileItem));
    setStatus(
      `${pdfFiles.length} FILE${pdfFiles.length > 1 ? "S" : ""} READY`
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileInput(event) {
    selectFiles(event.target.files);
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
    selectFiles(event.dataTransfer.files);
  }

  function updateFile(id, changes) {
    setSelectedFiles((currentFiles) =>
      currentFiles.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  }

  function startFakeProgress(id) {
    let progress = 8;
    updateFile(id, { progress });

    const intervalId = window.setInterval(() => {
      progress = Math.min(progress + Math.ceil(Math.random() * 9), 92);
      updateFile(id, { progress });
    }, 260);

    return () => window.clearInterval(intervalId);
  }

  async function processFile(item) {
    updateFile(item.id, {
      state: "processing",
      progress: 6,
      error: null,
    });

    const stopFakeProgress = startFakeProgress(item.id);
    const formData = new FormData();
    formData.append("pdf", item.file);

    try {
      const response = await fetch("http://localhost:3001/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const parsedRoute = await response.json();
      console.log(`Parser response for ${item.file.name}:`, parsedRoute);

      stopFakeProgress();
      updateFile(item.id, {
        state: "complete",
        progress: 100,
        parsedRoute,
      });
    } catch (error) {
      stopFakeProgress();
      console.error(error);
      updateFile(item.id, {
        state: "error",
        progress: 0,
        error: error.message,
      });
      throw error;
    }
  }

  async function handleConversion() {
    if (!selectedFiles.length || isLoading) return;

    setIsLoading(true);
    setStatus("CONVERTING ROUTES");

    try {
      for (const item of selectedFiles) {
        await processFile(item);
      }

      setStatus("DOCUMENT CONVERSION COMPLETE");
    } catch (error) {
      setStatus(`CONVERSION FAILED: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setSelectedFiles([]);
    setStatus("NOTHING HERE YET");
    setIsLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeFile(id) {
    if (isLoading) return;

    setSelectedFiles((currentFiles) => {
      const remainingFiles = currentFiles.filter((item) => item.id !== id);
      setStatus(
        remainingFiles.length
          ? `${remainingFiles.length} FILE${remainingFiles.length > 1 ? "S" : ""} READY`
          : "NOTHING HERE YET"
      );
      return remainingFiles;
    });
  }

  function getFileStatus(item) {
    const fileSize = Math.ceil(item.file.size / 1024);

    switch (item.state) {
      case "processing":
        return `${fileSize} KB — Converting… ${item.progress}%`;
      case "complete":
        return `${fileSize} KB — Conversion complete`;
      case "error":
        return `${fileSize} KB — Failed: ${item.error}`;
      default:
        return `${fileSize} KB — Ready to convert`;
    }
  }

  return (
    <main className={`app ${isLoading ? "is-loading" : ""}`}>
      <div className="app-background" aria-hidden="true" />

      <div className="app-shell">
        <header className="brand-header">
          <img
            className="brand-logo"
            src="/assets/liteload-logo.svg"
            alt="LiteLoad"
          />

          <div className="brand-copy">
            <div className="wordmark">
              <span className="lite">LITE</span>
              <span className="hyphen"> | </span>
              <span className="load">LOAD</span>
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
            multiple
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
          className={`conversion-panel ${
            selectedFiles.length ? "has-file" : ""
          }`}
          aria-live="polite"
          aria-busy={isLoading}
        >
          {!selectedFiles.length ? (
            <div className="conversion-content">
              <p className="empty-state">{status}</p>
            </div>
          ) : (
            <div className="file-list">
              {selectedFiles.map((item) => {
                const isProcessing = item.state === "processing";
                const isComplete = item.state === "complete";
                const isError = item.state === "error";

                return (
                  <article
                    className={`file-card ${isComplete ? "is-complete" : ""}`}
                    key={item.id}
                  >
                    <div
                      className="file-type"
                      aria-label={`Route ${item.routeNumber}`}
                    >
                      {item.routeNumber}
                    </div>

                    <div className="file-details">
                      <div className="progress-track" aria-hidden="true">
                        <div
                          className={`progress-fill ${
                            isProcessing
                              ? "is-processing"
                              : isError
                                ? "is-error"
                                : isComplete
                                  ? "is-complete"
                                  : "is-waiting"
                          }`}
                          style={{ "--progress": `${item.progress}%` }}
                        />
                      </div>

                      <p className="file-size">{getFileStatus(item)}</p>
                    </div>

                    <div
                      className={`file-status ${isError ? "is-error" : ""}`}
                      aria-label={
                        isComplete
                          ? "Complete"
                          : isProcessing
                            ? "Processing"
                            : isError
                              ? "Failed"
                              : "Waiting"
                      }
                    >
                      {isComplete
                        ? "✓"
                        : isProcessing
                          ? <span className="file-spinner" />
                          : isError
                            ? "!"
                            : ""}
                    </div>

                    <button
                      className="file-remove"
                      type="button"
                      onClick={() => removeFile(item.id)}
                      disabled={isLoading}
                      aria-label={`Remove route ${item.routeNumber}`}
                    >
                      ×
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="action-row">
          <button
            className="action-button"
            type="button"
            disabled={!selectedFiles.length || isLoading}
            onClick={handleConversion}
          >
            {isLoading
              ? "Converting Documents..."
              : "Begin Document Conversion"}
          </button>

          <button
            className="action-button"
            type="button"
            disabled={!selectedFiles.length || isLoading}
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