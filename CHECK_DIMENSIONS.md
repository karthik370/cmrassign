# Dimension Mismatch - Quick Fix Guide

## 🐛 Problem
The preview/editor dimensions don't match the generated PDF dimensions.

## 🔍 Root Cause
The `dimensions` column might not exist in your database yet!

## ✅ Solution - Run Database Migration

### **Step 1: Check if Migration is Needed**

Open Supabase Dashboard → SQL Editor → Run this query:

```sql
-- Check if dimensions column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'page_edits' 
AND column_name = 'dimensions';
```

**Expected Result:**
- If you see `dimensions | jsonb` → Migration already done ✅
- If you see no results → You need to run the migration ❌

### **Step 2: Run the Migration**

If the column doesn't exist, run this SQL:

```sql
-- Add dimensions column to page_edits table
ALTER TABLE public.page_edits
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{"lineBoxHeight": 30.5, "lineSpacing": 23, "marginLeft": 40, "marginRight": -125, "marginTop": 93}'::jsonb;

-- Add comment to document the column
COMMENT ON COLUMN public.page_edits.dimensions IS 'Stores page-specific dimension settings: lineBoxHeight, lineSpacing, marginLeft, marginRight, marginTop';
```

### **Step 3: Verify It Worked**

Run the check query again:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'page_edits' 
AND column_name = 'dimensions';
```

You should now see: `dimensions | jsonb` ✅

### **Step 4: Test the Fix**

1. **Open any page** in the editor
2. **Adjust dimensions** (line spacing, margins, etc.)
3. **Wait 2 seconds** (auto-save)
4. **Generate PDF**
5. **Check console logs** - You should see:
   ```
   📐 Dimensions for page 1: {"lineBoxHeight":30.5,"lineSpacing":23,...}
   ```

## 📊 How to Verify Dimensions Match

### In Console (when generating PDF):
```
📐 Dimensions for page 1: {"lineBoxHeight":30.5,"lineSpacing":25,"marginTop":100}
📐 Using dimensions: lineSpacing=25, marginTop=100, marginLeft=40
```

### What to Check:
- ✅ `lineSpacing` should match what you set in editor
- ✅ `marginTop` should match what you set in editor
- ✅ `marginLeft` should match what you set in editor
- ✅ If using defaults, should be: `lineSpacing=23, marginTop=93, marginLeft=40`

## 🚨 Common Issues

### Issue 1: Dimensions are NULL
**Symptom:** Console shows `"dimensions": null`
**Solution:** The column exists but no data. Adjust dimensions in editor and save.

### Issue 2: Using Default Dimensions
**Symptom:** Console shows default values `lineSpacing=23` even though you changed it
**Causes:**
1. Migration not run - Column doesn't exist
2. Dimensions not saved - Auto-save failed
3. Old page edits - Created before dimensions were added

**Solution:**
1. Run migration SQL
2. Open each page in editor
3. Adjust any dimension slightly (to trigger save)
4. Wait 2 seconds for auto-save
5. Generate PDF again

### Issue 3: Different Dimensions Per Page
**This is normal!** Each page can have different dimensions.
**To verify:**
- Page 1 might have `lineSpacing=23`
- Page 2 might have `lineSpacing=25`
- This is intentional if you adjusted them separately

## 🎯 Quick Fix Checklist

- [ ] Run the migration SQL in Supabase
- [ ] Verify `dimensions` column exists
- [ ] Open a page in editor
- [ ] Adjust any dimension
- [ ] Wait for auto-save (2 seconds)
- [ ] Generate PDF
- [ ] Check console logs for dimension values
- [ ] Verify PDF matches preview

## 📝 Expected Console Output

When everything works correctly:
```
✍️  Processing page 1 - 250 chars
📐 Dimensions for page 1: {"lineBoxHeight":30.5,"lineSpacing":23,"marginLeft":40,"marginRight":-50,"marginTop":93}
📐 Using dimensions: lineSpacing=23, marginTop=93, marginLeft=40
📊 Page 1: 15 lines to render (max 35 per page)
✅ Page 1: Drew 15 lines
```

If dimensions aren't saved:
```
✍️  Processing page 1 - 250 chars
📐 Dimensions for page 1: {"lineBoxHeight":30.5,"lineSpacing":23,"marginLeft":40,"marginRight":-50,"marginTop":93}
                          ↑ These are DEFAULTS (no saved dimensions)
```

---

**Once migration is done, dimensions will persist and PDF will match preview perfectly!** ✨
