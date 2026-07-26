import { useRef, useState } from "react";
import "./App.css";

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

const MAX_FILES = 3;

function extractRouteNumber(filename) {
  const baseName = filename.replace(/\.[^/.]+$/, "").toUpperCase();

  const routeMatch = baseName.match(
    /(?:\bROUTE[\s_-]*)?\b([0-9]{1,3}[A-Z][0-9]{1,3})\b/
  );

  return routeMatch?.[1] ?? "ROUTE";
}

function ViewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="2.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3v11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="m7.5 10 4.5 4.5 4.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 19h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m7 7 10 10M17 7 7 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
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
      progress = Math.min(
        progress + Math.ceil(Math.random() * 9),
        92
      );

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
      const response = await fetch(
        "http://localhost:3001/parse",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const parsedRoute = await response.json();

      console.log(
        `Parser response for ${item.file.name}:`,
        parsedRoute
      );

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
    if (!selectedFiles.length || isLoading) {
      return;
    }

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
    if (isLoading) {
      return;
    }

    setSelectedFiles((currentFiles) => {
      const remainingFiles = currentFiles.filter(
        (item) => item.id !== id
      );

      setStatus(
        remainingFiles.length
          ? `${remainingFiles.length} FILE${
              remainingFiles.length > 1 ? "S" : ""
            } READY`
          : "NOTHING HERE YET"
      );

      return remainingFiles;
    });
  }

  function handleViewRoute(item) {
    if (!item.parsedRoute) {
      return;
    }

    console.log(
      `View route ${item.routeNumber}:`,
      item.parsedRoute
    );
  }

  function handleDownloadRoute(item) {
    if (!item.parsedRoute) {
      return;
    }

    const routeJson = JSON.stringify(
      item.parsedRoute,
      null,
      2
    );

    const routeBlob = new Blob([routeJson], {
      type: "application/json",
    });

    const downloadUrl = URL.createObjectURL(routeBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = `${item.routeNumber}.json`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);
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
    <main
      className={`app ${isLoading ? "is-loading" : ""}`}
    >
      <div
        className="app-background"
        aria-hidden="true"
      />

      <div className="app-shell">
        <header className="brand-header">
          <img
            className="brand-logo"
            src={asset("liteload-logo.svg")}
            alt="LiteLoad"
          />

          <div className="brand-copy">
            <div className="wordmark">
              <span className="lite">LITE</span>

              <span className="hyphen">
                {" "}
                |{" "}
              </span>

              <span className="load">LOAD</span>
            </div>

            <p>LET’S STACK THIS PAPER</p>
          </div>
        </header>

        <div className="header-rule" />

        <section
          className={`drop-zone ${
            isDragging ? "is-dragging" : ""
          }`}
          onClick={() =>
            fileInputRef.current?.click()
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
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
            src={asset("liteload-truck.png")}
            alt=""
          />

          <h1>DRAG AND DROP FILES HERE</h1>

          <p>LEGACY .PDF FILE FORMAT</p>
        </section>

        <section
          className={`conversion-panel ${
            selectedFiles.length
              ? "has-file"
              : ""
          }`}
          aria-live="polite"
          aria-busy={isLoading}
        >
          {!selectedFiles.length ? (
            <div className="conversion-content">
              <p className="empty-state">
                {status}
              </p>
            </div>
          ) : (
            <div className="file-list">
              {selectedFiles.map((item) => {
                const isProcessing =
                  item.state === "processing";

                const isComplete =
                  item.state === "complete";

                const isError =
                  item.state === "error";

                const routeIsAvailable =
                  isComplete &&
                  Boolean(item.parsedRoute);

                return (
                  <article
                    className={`file-card ${
                      isComplete
                        ? "is-complete"
                        : ""
                    }`}
                    key={item.id}
                  >
                    <div
                      className="file-type"
                      aria-label={`Route ${item.routeNumber}`}
                    >
                      {item.routeNumber}
                    </div>

                    <div className="file-details">
                      <div
                        className="progress-track"
                        aria-hidden="true"
                      >
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
                          style={{
                            "--progress": `${item.progress}%`,
                          }}
                        />
                      </div>

                      <p className="file-size">
                        {getFileStatus(item)}
                      </p>
                    </div>

                    <div className="file-status-area">
                      <div
                        className={`file-status ${
                          isError
                            ? "is-error"
                            : ""
                        }`}
                        aria-label={
                          isComplete
                            ? "Complete"
                            : isProcessing
                              ? "Processing"
                              : isError
                                ? "Failed"
                                : "Waiting"
                        }
                        role="status"
                      >
                        {isComplete ? (
                          "✓"
                        ) : isProcessing ? (
                          <span className="file-spinner" />
                        ) : isError ? (
                          "!"
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="file-actions">
                        <button
                          className="file-action-button view-button"
                          type="button"
                          onClick={() =>
                            handleViewRoute(item)
                          }
                          disabled={
                            !routeIsAvailable
                          }
                          aria-label={`View route ${item.routeNumber}`}
                          title="View route"
                        >
                          <ViewIcon />
                        </button>

                        <button
                          className="file-action-button download-button"
                          type="button"
                          onClick={() =>
                            handleDownloadRoute(item)
                          }
                          disabled={
                            !routeIsAvailable
                          }
                          aria-label={`Download route ${item.routeNumber}`}
                          title="Download route"
                        >
                          <DownloadIcon />
                        </button>

                        <button
                          className="file-action-button remove-button"
                          type="button"
                          onClick={() =>
                            removeFile(item.id)
                          }
                          disabled={isLoading}
                          aria-label={`Remove route ${item.routeNumber}`}
                          title="Remove route"
                        >
                          <RemoveIcon />
                        </button>
                      </div>
                    </div>
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
            disabled={
              !selectedFiles.length ||
              isLoading
            }
            onClick={handleConversion}
          >
            {isLoading
              ? "Converting Documents..."
              : "Begin Document Conversion"}
          </button>

          <button
            className="action-button"
            type="button"
            disabled={
              !selectedFiles.length ||
              isLoading
            }
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