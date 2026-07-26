# LiteLoad

> **Reducing cognitive load for warehouse teams.**

LiteLoad is a loader-first application that translates legacy warehouse data into modern, task-oriented workflows.

Rather than replacing Warehouse Management Systems, LiteLoad augments existing enterprise software by transforming operational data into interfaces designed for the people who actually move freight.

---

# Why

Enterprise warehouse software has become remarkably sophisticated.

The experience of the people doing the work has not.

Every night, warehouse employees spend valuable time mentally decoding dense reports before they can begin physical work. That cognitive effort slows operations, increases fatigue, and contributes to avoidable mistakes.

LiteLoad exists to modernize the final stage of warehouse operations—the point where enterprise data becomes physical work.

Warehouse Management Systems already know **what** needs to happen.

LiteLoad focuses on making that information easier for humans to understand.

> **Good software shouldn't ask frontline workers to think like databases.**

---

# Objectives

- Reduce cognitive load.
- Increase loading speed.
- Improve loading accuracy.
- Reduce training time.
- Preserve existing enterprise software investments.
- Build software around the people doing the work.
- Modernize legacy workflows without disrupting existing operations.

---

# Decisions

## Loader First

Every design decision begins with the warehouse worker, not the database.

## Translate, Don't Replace

LiteLoad complements existing Warehouse Management Systems instead of competing with them.

Organizations shouldn't have to replace proven operational systems to improve the experience of their frontline teams.

## Extract Only What Matters

The parser intentionally ignores unnecessary metadata and extracts only the information required by the working document.

Information should earn its place on the screen.

## Separate Translation from Presentation

Document understanding and user experience are independent systems.

Every parser produces the same standardized route model, allowing the interface to remain consistent regardless of the source system.

## Build for Expansion

Supporting another warehouse system should require building a new parser—not redesigning the application.

---

# Architecture

LiteLoad separates **data translation** from **user experience**.

Every supported warehouse system produces the same internal route model, allowing the interface to remain consistent regardless of the source document or WMS.

```text
                     LiteLoad

        Legacy Warehouse Systems / Documents
 ┌──────────────┬──────────────┬──────────────┐
 │              │              │
AS/400 PDFs   CSV Exports    WMS APIs
 │              │              │
 └──────────────┴──────────────┘
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

The parser understands warehouse documents.

React understands people.

JSON is the contract between them.

---

# Technology Stack

## Frontend

- React
- Vite

## Backend

- Express (Node.js)
- Python
- pypdf

## Data Model

- Standardized Route JSON

## Planned

- PostgreSQL

---

# Current Progress

## Completed

- ✅ React frontend
- ✅ Express backend
- ✅ React ↔ Express integration
- ✅ Python parser architecture
- ✅ PDF text extraction
- ✅ Standardized Route JSON model
- ✅ Drag-and-drop loading workflow
- ✅ GitHub Pages deployment
- ✅ Loader-first UX framework
- ✅ Warehouse workflow research

## In Progress

- 🔄 Live parser integration
- 🔄 Dynamic header rendering
- 🔄 Dynamic route rendering
- 🔄 PDF upload pipeline

---

# Roadmap

- ⏳ Warehouse pilot
- ⏳ Support for additional warehouse systems
- ⏳ Additional document adapters
- ⏳ PostgreSQL persistence
- ⏳ Production deployment

---

# License

MIT License
