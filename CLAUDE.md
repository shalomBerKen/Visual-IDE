# CLAUDE - Project Context & Vision

## מהו הפרויקט?

**Visual IDE** - פלטפורמה שהופכת כתיבת קוד לנגישה לכולם על ידי המרת קוד טקסטואלי לממשק גרפי אינטואיטיבי.

---

## החזון המרכזי

### הבעיה שאנחנו פותרים
כיום, כתיבת קוד דורשת ידע בתחביר מסובך, סוגריים, indentation, ושפה טכנית. אנשים רבים מקבלים קוד (למשל מ-AI), אבל לא יכולים להבין או לערוך אותו בביטחון.

### הפתרון שלנו
IDE שמציג קוד כ**ממשק משתמש** - בדיוק כמו חלון הגדרות של אפליקציה מודרנית:
- **במקום סוגריים** → קופסאות מעוצבות ומתחומות
- **במקום indentation** → blocks מקוננים ויזואלית
- **במקום תחביר** → טפסים, כפתורים, dropdowns

### Use Case עיקרי
```
משתמש מקבל קוד מ-ChatGPT
    ↓
מדביק אותו ב-Visual IDE
    ↓
רואה ומבין מה קורה (blocks ויזואליים)
    ↓
עורך בביטחון (דרך UI אינטואיטיבי)
    ↓
מייצא קוד עובד ותקין
```

---

## עקרונות תכנון מרכזיים

### 1. Code as UI, Not Text
הקוד לא נראה כמו טקסט, אלא כמו **ממשק הגדרות**:
- כל פונקציה = card מתקפל/מתרחב
- כל תנאי = condition builder עם dropdowns
- כל לולאה = panel עם קונפיגורציה

### 2. אפס ידע מוקדם נדרש
המשתמש לא צריך לדעת:
- איך כותבים `def` או `function`
- איפה לשים סוגריים
- מה זה indentation
- מה ההבדל בין `=` ל-`==`

הכל מונגש דרך כפתורים וטפסים עם labels ברורים.

### 3. שפה-אגנוסטי (Language Agnostic)
המערכת בנויה כך שניתן להוסיף שxxxxxxלות:
- Python, JavaScript, Java, C++, Go...
- כל שפה = plugin עם parser + compiler + blocks definitions
- UI משותף לכל השפות

### 4. דו-כיווני (Bi-directional)
- **Code → Visual**: הדבק קוד, קבל blocks
- **Visual → Code**: ערוך blocks, ייצא קוד
- **Live Sync**: שינויים בכל כיוון מתעדכנים מיידית

---

## המטרה הארוכת טווח

IDE מלא שמאפשר:
1. **עריכה ויזואלית** של קוד מורכב
2. **ניהול פרויקטים** multi-file
3. **הרצה ו-debugging** ויזואלי
4. **Git operations** דרך UI
5. **AI-assisted development** משולב
6. **תמיכה בכל שפות התכנות הפופולריות**

---

## ארכיטקטורה - תמונת מצב גבוהה

```
Visual IDE
│
├─ Frontend (React + TypeScript)
│  ├─ Visual Canvas (משטח עבודה)
│  ├─ Block Components (הקופסאות הויזואליות)
│  ├─ Property Editors (טפסים לעריכת blocks)
│  └─ Code Preview (תצוגת קוד מקבילה)
│
├─ Core Engine
│  ├─ AST Manager (ייצוג פנימי אחיד)
│  ├─ Parser (Code → AST → Blocks)
│  ├─ Compiler (Blocks → AST → Code)
│  └─ Validator (בדיקת תקינות)
│
└─ Language Plugins
   ├─ Python Plugin
   ├─ JavaScript Plugin
   └─ [Future languages...]
```

---

## שלבי הפיתוח

### Phase 1: MVP - Python Only (נוכחי)
**מטרה**: להוכיח את הקונספט עם שפה אחת

**Deliverables**:
1. ✅ Setup פרויקט
2. ✅ 5 blocks בסיסיים: Function, Variable, If/Else, Loop, Return
3. ✅ Code Import (paste Python → visual blocks)
4. ✅ Code Export (visual blocks → Python)
5. ✅ עיצוב מלוטש ואינטואיטיבי
6. ✅ Parameter editing for functions
7. ✅ Delete blocks functionality
8. ✅ Nested blocks support

**Success Criteria**:
משתמש יכול להדביק פונקציה פשוטה, לראות אותה ויזואלית, לערוך, ולקבל קוד תקין בחזרה.

### Phase 2: Language Engine
**מטרה**: הפיכה למודולרי - תמיכה ב-JS/TS

הוספת שפה שנייה תאמת שהארכיטקטורה עובדת.

### Phase 3: Advanced Features
- Blocks מתקדמים (classes, async, exceptions)
- Visual debugger
- AI integration

### Phase 4: Full IDE
- Multi-file projects
- Terminal & execution
- Git UI
- Package management

---

## עקרונות UX חשובים

### תורת העיצוב
**"נגיש כמו הגדרות Windows, חזק כמו VS Code"**

המשתמש צריך להרגיש כאילו הוא:
- ✅ ממלא טופס באתר
- ✅ מסדר הגדרות באפליקציה
- ✅ בונה משהו ב-drag & drop

הוא **לא** צריך להרגיש כאילו הוא:
- ❌ כותב בשפה זרה
- ❌ מנחש איפה לשים תווים מיוחדים
- ❌ מפחד לשבור משהו

### Visual Language
- **Boxes במקום סוגריים**: כל scope = card מתוחם
- **צבעים**: כל סוג block = צבע משלו
- **אייקונים**: זיהוי מהיר של סוג הפעולה
- **Expansion/Collapse**: הסתרת מורכבות
- **Inline Editing**: לחיצה = פתיחת editor נוח

---

## טכנולוגיות מרכזיות

### Frontend Stack
- **React 18** + **TypeScript** (type safety חיוני)
- **Tailwind CSS** (עיצוב מהיר וקונסיסטנטי)
- **Zustand** (state management קל)
- **React DnD Kit** (drag & drop)
- **Monaco Editor** (Code Mode view)
- **Vite** (build tool)

### Parsing & AST
- **Python**: Tree-sitter / custom parser
- **JavaScript**: @babel/parser
- **Generic**: Tree-sitter library (40+ languages)

### Future
- **Electron** (desktop app)
- **LSP Integration** (autocomplete, errors)
- **Web Assembly** (code execution in browser)

---

## מה הופך את הפרויקט הזה לייחודי?

### לא Scratch
Scratch נהדר לילדים, אבל:
- ❌ לא מייצר קוד אמיתי
- ❌ לא מתאים לפרויקטים מורכבים
- ❌ לא תומך בשפות אמיתיות

### לא Low-Code Platform
Bubble, Webflow וחברים מעולים, אבל:
- ❌ מוגבלים לתחום ספציפי (web apps)
- ❌ לא מאפשרים שליטה מלאה
- ❌ לא מייצאים קוד נקי ועצמאי

### Visual IDE = Best of Both Worlds
✅ שפות אמיתיות (Python, JS, etc.)
✅ קוד מלא ומורכב כמו ב-IDE רגיל
✅ ממשק ויזואלי לנגישות
✅ דו-כיווני - עבוד איך שנוח לך
✅ ניתן לעבור ל-IDE רגיל בכל רגע (זה קוד אמיתי!)

---

## Success Metrics

### MVP Success
1. משתמש מדביק פונקציה של 20 שורות → רואה אותה ויזואלית
2. משתמש משנה ערך בתנאי → הקוד המיוצא משתנה בהתאם
3. משתמש יוצר פונקציה חדשה מאפס דרך UI → הקוד תקין

### Long-term Success
1. מישהו ללא רקע בתכנות מצליח לערוך סקריפט Python פשוט
2. מפתח מנוסה משתמש ב-Visual IDE לקריאת קוד מורכב
3. צוותים משתמשים ב-Visual IDE כ-documentation interactive

---

## הערות חשובות לפיתוח

### אל תבנה יותר מדי מוקדם
- התחל עם blocks פשוטים ומוגבלים
- אל תנסה לתמוך בכל feature של Python ביום אחד
- בנה מה שצריך ל-use case הבסיסי, הרחב בהדרגה

### שמור על הפשטות
- יותר טוב block פשוט ומוגבל מאשר block שמבלבל
- אם משהו מורכב מדי לויזואליזציה - זה בסדר להשאיר אותו טקסטואלי בינתיים
- Focus על 80% מהמקרים, לא 100%

### עיצוב זה הכל
- משתמש שמבולבל מה-UI לא יצליח גם אם הקוד מושלם
- השקע זמן בעיצוב ואינטואיטיביות
- בדוק עם אנשים שלא מכירים קוד

---

## Contact & Philosophy

**Vision**: להפוך תכנות לנגיש כמו שימוש במחשב - כולם יכולים, לא רק "טכנאים".

**Approach**: בנה בהדרגה, תן ל-users להנחות, אל תיאהב ב-code שלך (refactor ללא רחמים).

---

*Last Updated: 2025-09-30*
*Project Status: Phase 1 - MVP Complete! 🎉*