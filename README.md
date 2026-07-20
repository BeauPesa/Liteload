# LiteLoad

> **Reducing cognitive load for warehouse teams.**

LiteLoad is a loader-first warehouse interface that transforms legacy load manifests into a modern, structured workflow.

Instead of replacing an organization's Warehouse Management System (WMS), LiteLoad translates operational data into a consistent internal model and presents it through an interface designed for the people who actually load trucks.

The objective is simple:

- Less time decoding paperwork.
- More time loading accurately.
- Better software for physically demanding work.

---

## Why LiteLoad?

Most warehouse software is designed around inventory, planning, and management.

Very little of it is designed around the cognitive experience of the warehouse loader.

After working overnight warehouse shifts, I observed that experienced employees spent a surprising amount of time mentally decoding dense AS/400 load manifests before they could begin physical work.

LiteLoad treats that cognitive overhead as a design problem.

Rather than asking warehouse workers to adapt to legacy software, LiteLoad adapts legacy data into an interface built around clarity, speed, and usability.

---

## Architecture

Warehouse Data
      │
      ▼
Python Parser
(understands warehouses)
      │
      ▼
Structured Route Object
      │
      ▼
Express API
(transports data)
      │
      ▼
React UI
(presents data)
      │
      ▼
Warehouse Worker

Each warehouse system has its own parser or adapter.

Their only responsibility is to translate data into LiteLoad's internal JSON schema.

Once data reaches that format, every downstream component remains unchanged.

This separation allows LiteLoad to support additional warehouse systems without redesigning the interface.

---

## Current Status

### Completed

- Python PDF text extraction
- Initial parser architecture
- JSON generation pipeline
- GitHub Pages deployment
- Loader-first interface research
- Warehouse workflow analysis

### In Progress

- Structured route parser
- React component library
- Interactive loading interface
- Route visualization
- Warehouse pilot

---

## Technology Stack

### Backend

- Python
- pypdf
- JSON

### Frontend

- React
- HTML
- CSS
- JavaScript

### Development

- Git
- GitHub
- GitHub Pages
- Visual Studio Code

---

## Design Principles

### Loader First

Reduce cognitive effort wherever possible.

### Human-Centered

Warehouse software should support the worker, not the other way around.

### Modular

Separate data translation from interface design.

### Extensible

Support new warehouse systems through additional parsers and adapters rather than rewriting the application.

### Offline Friendly

Core workflows should not depend on continuous cloud connectivity or AI services.

---

## Roadmap

- [x] PDF text extraction
- [x] Initial parser architecture
- [x] LiteLoad JSON pipeline
- [ ] Structured route parser
- [ ] React interface
- [ ] Drag-and-drop truck loading
- [ ] Multi-WMS adapters
- [ ] Warehouse pilot
- [ ] Production deployment

---

## Project Vision

LiteLoad is not intended to replace warehouse management systems.

Its purpose is to improve the final stage of warehouse operations—the point where operational data becomes physical work.

By separating data translation from presentation, LiteLoad creates a scalable architecture capable of supporting multiple warehouse systems while maintaining a single, consistent user experience.

Good software should reduce mental workload.

Warehouse workers deserve software designed with the same care as the systems built for executives.

---

## License

MIT License
