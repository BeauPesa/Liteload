# LiteLoad

> **Reducing cognitive load for warehouse teams.**

LiteLoad is a loader-first application that translates legacy warehouse data into a modern, task-oriented loading experience.

Rather than replacing Warehouse Management Systems, LiteLoad augments existing enterprise software by transforming operational data into interfaces designed for the people doing the work.

---

# Why

Modern warehouses run on sophisticated enterprise software.

The people loading trucks often do not.

Every night, experienced warehouse employees spend valuable time mentally decoding dense load manifests before they can begin physical work.

LiteLoad exists because that cognitive effort is unnecessary.

Warehouse Management Systems already know what needs to happen.

LiteLoad makes that information easier for humans to understand.

---

# Objectives

- Reduce cognitive load.
- Increase loading speed.
- Improve loading accuracy.
- Reduce training time.
- Preserve existing warehouse software investments.
- Build software around the people doing the work.

---

# Principles

### Loader First

Design every interface around the warehouse loader.

---

### Translate, Don't Replace

LiteLoad complements existing Warehouse Management Systems instead of competing with them.

---

### Ignore the Noise

The parser intentionally extracts only the information required by the working document.

Everything else remains metadata.

---

### Separate Translation from Presentation

Every supported warehouse document is translated into the same standardized route model.

The interface stays consistent regardless of where the data originated.

---

### Modular by Design

Adding support for another warehouse system should require a new parser—not a redesigned application.

---

# Architecture

```
            Legacy Warehouse Systems

      AS/400 PDFs   CSV Exports   WMS APIs
             │            │            │
             └────────────┴────────────┘
                          │
                          ▼
             Python Parsers / Adapters
                          │
                          ▼
                Standardized Route JSON
                          │
                          ▼
                 Express Backend API
                          │
                          ▼
                React Loader Interface
                          │
                          ▼
          Faster • Safer • Lower Cognitive Load
```

LiteLoad separates **document understanding** from **user experience**.

The parser understands warehouse documents.

React understands people.

JSON is the contract between them.

---

# Current Technology

## Frontend

- React
- Vite

## Backend

- Express (Node.js)
- Python
- pypdf

## Data

- JSON

## Planned

- PostgreSQL

---

# Roadmap

## Completed

- ✅ React frontend
- ✅ Express backend
- ✅ React ↔ Express integration
- ✅ Python parser architecture
- ✅ PDF text extraction
- ✅ Standardized JSON route model
- ✅ Drag-and-drop loading workflow
- ✅ GitHub Pages deployment
- ✅ Loader-first UX framework

## In Progress

- 🔄 Live parser integration
- 🔄 Dynamic header rendering
- 🔄 Dynamic route rendering
- 🔄 PDF upload pipeline

## Planned

- ⏳ Warehouse pilot
- ⏳ Multi-WMS adapters
- ⏳ PostgreSQL persistence
- ⏳ Production deployment

---

# Vision

LiteLoad modernizes the final stage of warehouse operations:

**The point where enterprise data becomes physical work.**

By translating operational complexity into human-centered interfaces, LiteLoad helps organizations improve speed, consistency, and usability without replacing the systems they already trust.

> **Good software shouldn't ask frontline workers to think like databases.**

---

## License

MIT License
