# LiteLoad

**Reducing cognitive load for warehouse teams.**

LiteLoad is a loader-first application that translates legacy warehouse data into a modern, task-oriented loading experience.

Rather than replacing an organization's Warehouse Management System (WMS), LiteLoad augments existing systems by translating operational data into a standardized route model and presenting it through an interface designed for the people who actually load trucks.

---

## The Problem

Modern warehouses run on sophisticated enterprise software, but the information reaching frontline workers is often delivered through dense reports and legacy printouts.

Experienced warehouse employees spend valuable time mentally decoding paperwork before they can begin physical work.

LiteLoad treats that cognitive overhead as a design problem.

Instead of asking workers to adapt to legacy software, LiteLoad adapts legacy data into an interface built around clarity, speed, and usability.

---

## How It Works

LiteLoad separates **data translation** from **user experience**.

Regardless of where operational data originates, every supported document or system is translated into the same standardized route model.

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

This architecture allows LiteLoad to support additional warehouse systems without redesigning the user experience.

---

## Component Responsibilities

### Python Parser

The parser understands warehouse documents and extracts only the information required by the working document.

Current parsed fields include:

- Route
- Delivery Date
- Cubes
- Page Number

Operational fields such as **Door**, **Truck**, and **Driver** remain editable because they are assigned during warehouse operations rather than contained in the source document.

The parser outputs standardized JSON consumed by the application.

### Express Backend

- Receives uploaded documents
- Executes the parser
- Returns structured JSON to the frontend

### React Frontend

- Renders the standardized route model
- Provides the loader-first interface
- Handles user interaction
- Minimizes cognitive load during loading operations

---

## Current Status

### Completed

- ✅ React frontend
- ✅ Express backend
- ✅ Python parser architecture
- ✅ Standardized JSON route model
- ✅ PDF text extraction
- ✅ GitHub Pages deployment
- ✅ Loader-first UX framework
- ✅ Warehouse workflow research

### In Progress

- 🔄 Live parser integration
- 🔄 Dynamic header rendering
- 🔄 Route rendering
- 🔄 Interactive loading workflow
- 🔄 Warehouse pilot

---

## Technology Stack

### Frontend

- React
- Vite

### Backend

- Express (Node.js)
- Python
- pypdf

### Data

- JSON

### Planned

- PostgreSQL

---

## Design Principles

### Loader First

Design for the people doing the work.

### Reduce Cognitive Load

Every interface decision should reduce unnecessary thinking.

### Translate, Don't Replace

LiteLoad complements existing Warehouse Management Systems rather than competing with them.

### Modular

Separate document translation from presentation.

### Extensible

Support additional warehouse systems by adding parsers and adapters rather than redesigning the interface.

### Offline Friendly

Core warehouse workflows should not depend on continuous cloud connectivity or AI services.

---

## Roadmap

- ✅ Legacy document parsing
- ✅ Standardized JSON route model
- ✅ React frontend
- ✅ Express backend
- 🔄 Live parser integration
- 🔄 Dynamic header rendering
- 🔄 Full route rendering
- ⏳ Drag-and-drop loading workflow
- ⏳ Warehouse pilot
- ⏳ Multi-WMS adapters
- ⏳ Production deployment

---

## Vision

LiteLoad modernizes the final stage of warehouse operations—the point where enterprise data becomes physical work.

Rather than replacing Warehouse Management Systems, LiteLoad translates operational complexity into interfaces designed for frontline workers.

**Good software shouldn't ask frontline workers to think like databases.**

---

## License

MIT License
