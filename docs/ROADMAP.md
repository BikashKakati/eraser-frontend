# Flowbit — Product Development Tracker
A visual diagramming tool for building systems using nodes and connections.

---

# 1. Core Features

## 1.1 Node Creation

### Completed
- Rectangle node creation from sidebar
- Ellipse node creation from sidebar
- Drag to place nodes on canvas
- Nodes render at cursor drop position
- Node resizing

### Pending
- Node rotation
- Node duplication
- Delete node

---

## 1.2 Node Text Editing

### Completed
- Double click to edit node text
- Inline text editing inside node
- Automatic line wrapping
- Node height auto-expands when text overflows

### Pending
- Text alignment options
- Font size control
- Bold / Italic formatting

---

## 1.3 Arrow Connections

### Completed
- Arrow tool from sidebar
- Connect nodes using arrows
- Snap arrow start to node
- Snap arrow end to node
- Arrow follows mouse movement
- Anchor points visible near nodes
- Disconnect arrow by selecting anchor
- Arrow auto-adjust when node moves

### Pending
- Arrow labels
- Arrow types (straight / curved / elbow)
- Arrow styling (dashed / thick)
- Arrow Position change by dragging


---

## 1.4 Node Interaction

### Completed
- Node hover detection
- Snap anchors appear near nodes
- Node selection

### Pending
- Multi-node selection
- Shift select
- Grouping nodes
- Drag multiple nodes

---

## 1.5 Canvas Interaction

### Completed
- Node drag movement
- Arrow drawing interaction

### Pending
- Pan canvas
- Zoom canvas
- Zoom with mouse wheel
- Fit canvas to view
- Infinite canvas boundaries

---

# 2. UI Improvements

### Completed
- Sidebar with tools
- Convert sidebar to icon-based toolbar
- Use SVG icon library (lucide-react)
- Floating toolbar UI
- Tool active state highlight

### Pending
- Hover shows title properly

---


# 4. Performance
### Completed

### Pending
- Optimize re-render of nodes
- Virtualized canvas rendering
- Efficient arrow updates
- Reduce unnecessary React renders

---

# 5. Data Model

### Completed

### Pending

---

# 6. Persistence
### Current

### Pending
- Local storage save
- Manual save
- Auto-save
- Load saved diagram

---

# 7. Advanced Features (Future)
- Node icons
- Image nodes
- Sticky notes
- Code block nodes
- Node templates
- Copy / paste nodes
- Undo / redo
- Keyboard shortcuts

---

# 8. Known Bugs
- Resize nodes does not feel smooth
- Resizing nodes affect connected arrows


# 9. Immediate Next Tasks

Priority order:
1. Plan and add save/load functionality --Done
2. A bar which basically holds a nodes properties like bg/border color, delete, duplicate, ---Done
3. Implement canvas pan + zoom -- Done
4. Grouping/Ungrouping functionality with nested grouping

