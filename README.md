# LiteLoad

**Reducing cognitive load for warehouse teams.**

LiteLoad is a loader-first warehouse application that transforms legacy warehouse data into a modern, structured loading experience.

Instead of replacing an organization's Warehouse Management System (WMS), LiteLoad translates operational data into a consistent internal route model and presents it through an interface designed for the people who actually load trucks.

## The Objective

- Less time decoding paperwork.
- More time loading accurately.
- Better software for physically demanding work.

---

# Why LiteLoad?

Most warehouse software is designed around inventory, planning, and management.

Very little of it is designed around the cognitive experience of the warehouse loader.

After working overnight warehouse shifts, I observed that experienced employees spent a surprising amount of time mentally decoding dense AS/400 load manifests before they could begin physical work.

LiteLoad treats that cognitive overhead as a design problem.

Rather than asking warehouse workers to adapt to legacy software, LiteLoad adapts legacy data into an interface built around clarity, speed, and usability.

---

# Architecture

LiteLoad separates **data translation** from **user experience**.

Every warehouse system has its own parser or adapter, but every parser produces the same standardized route model.

```text
                    LiteLoad

        Warehouse Systems / Documents
   ┌─────────────┬─────────────┬─────────────┐
   │             │             │
 AS/400 PDF   CSV Export    WMS APIs
   │             │             │
   └─────────────┴─────────────┘
                 │
                 ▼
        Python Parsers / Adapters
                 │
                 ▼
        Standardized Route Model
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

### Component Responsibilities

### Python

- Understands warehouse documents
- Extracts routes, stops, quantities, and metadata
- Produces a standardized route model

### Express

- Connects React to the parser
- Receives uploaded documents
- Executes the parser
- Returns structured route data

### React

- Presents warehouse information clearly
- Handles user interaction
- Renders the loader-first workflow

Because each parser produces the same route model, LiteLoad can support additional warehouse systems without redesigning the interface.

---

# Current Status

## Completed

- ✅ PDF text extraction
- ✅ Parser architecture
- ✅ Standardized route model
- ✅ Express backend
- ✅ React application
- ✅ GitHub Pages deployment
- ✅ Loader-first UX research
- ✅ Warehouse workflow analysis

## In Progress

- 🔄 React ↔ Express integration
- 🔄 Live PDF upload
- 🔄 Dynamic route rendering
- 🔄 Interactive loading workflow
- 🔄 Warehouse pilot

---

# Technology Stack

## Backend

- Python
- pypdf
- Express.js
- REST API

## Frontend

- React
- HTML
- CSS
- JavaScript

## Development

- Git
- GitHub
- GitHub Pages
- Visual Studio Code

---

# Design Principles

## Loader First

Reduce cognitive effort wherever possible.

## Human-Centered

Warehouse software should support the worker—not the other way around.

## Modular

Separate data translation from presentation.

## Extensible

Support additional warehouse systems by adding parsers and adapters rather than redesigning the application.

## Offline Friendly

Core workflows should not depend on continuous cloud connectivity or AI services.

---

# Roadmap

- ✅ PDF text extraction
- ✅ Parser architecture
- ✅ Standardized route model
- ✅ Express backend
- 🔄 React integration
- 🔄 Dynamic route rendering
- ⏳ Drag-and-drop loading workflow
- ⏳ Multi-WMS adapters
- ⏳ Warehouse pilot
- ⏳ Production deployment

---

# Project Vision

LiteLoad is not intended to replace Warehouse Management Systems.

Its purpose is to modernize the final stage of warehouse operations—the point where operational data becomes physical work.

By separating data translation from presentation, LiteLoad creates a scalable architecture capable of supporting multiple warehouse systems while maintaining a consistent loader experience.

Good software should reduce mental workload.

Warehouse workers deserve software designed with the same care as the systems built for executives.

---

# License

MIT License
