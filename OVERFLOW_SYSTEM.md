# Real-Time Overflow System

## ✨ What It Does

When you type text in the textarea that exceeds the page capacity, the **overflow text automatically flows to the next page in REAL-TIME**!

## 🔄 How It Works

### **Typing on Page 1:**
1. Type text until it fills the page
2. **Instantly**: Overflow lines appear on Page 2's textarea
3. Keep typing → Page 2 updates in real-time
4. Delete text on Page 1 → Page 2 automatically clears

### **Visual Indicators:**

#### **Page with Overflow (Page 1):**
```
⚠️ Real-Time Overflow Active
   15 lines → Page 2 (auto-updating)
   [View Next Page →]
```

#### **Page Receiving Overflow (Page 2):**
```
✨ Real-Time Auto-Filled
   15 overflow lines from Page 1
   [← Back to Page 1]
```

## 🎯 Key Features

✅ **Real-Time** - No delays, instant updates as you type
✅ **Automatic** - No manual actions needed
✅ **Bi-Directional** - Add text = fills next page, delete text = clears next page
✅ **Visual Feedback** - Clear indicators showing overflow status
✅ **Navigation** - Quick buttons to jump between overflow pages
✅ **Dimension-Aware** - Adjusting line spacing/margins recalculates overflow instantly

## 📝 Example Flow

1. **Start on Page 1** - Type a long essay
2. **Text fills up** - Orange banner appears: "Real-Time Overflow Active"
3. **Keep typing** - Watch line count increase: "15 lines → Page 2"
4. **Go to Page 2** - See blue banner: "Real-Time Auto-Filled"
5. **Check textarea** - Overflow text is already there!
6. **Go back to Page 1** - Delete some text
7. **Go to Page 2** - Overflow automatically reduced/cleared!

## 🛠️ Technical Details

### **Triggers for Overflow Update:**
- Text changes in textarea
- Line spacing changes
- Margin top changes
- Line box height changes
- Any dimension that affects line capacity

### **Smart Overflow Logic:**
- Calculates `maxLinesPerPage` based on:
  - Page height
  - Margin top
  - Line spacing
  - Line box height
- Splits text into lines automatically
- Sends overflow lines to next page
- Preserves text formatting and line breaks

### **Performance:**
- Debounced updates (2 seconds for save)
- Instant UI updates (0ms for preview)
- Efficient re-rendering (only affected pages update)

## 🎨 UI Components

1. **Overflow Warning Banner** (Orange) - Shows on source page
2. **Auto-Fill Badge** (Blue) - Shows on receiving page  
3. **Line Counter** - "X lines overflow to next page"
4. **Navigation Buttons** - Quick page switching
5. **Real-Time Label** - Emphasizes live updates

## 💾 Persistence

- Overflow text **auto-saves** after 2 seconds
- Each page maintains its own content
- Next page stores the overflow text permanently
- Reload page → overflow is still there!

## ⚡ Real-Time Formula

```
maxLinesPerPage = (pageHeight - marginTop - 80) / lineSpacing
overflowLines = textLines.slice(maxLinesPerPage)
nextPageText = overflowLines.join('\n')
```

**Updates triggered by:** inputText, lineSpacing, marginTop, lineBoxHeight changes

## 🚀 Result

You now have a **Google Docs-style text flow** where content automatically continues on the next page as you type! Perfect for multi-page essays, letters, and documents.
