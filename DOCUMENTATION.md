# Visual IDE - תיעוד מקיף

## תוכן עניינים
1. [סקירה כללית](#סקירה-כללית)
2. [ארכיטקטורת הפרויקט](#ארכיטקטורת-הפרויקט)
3. [סוגי בלוקים](#סוגי-בלוקים)
4. [רכיבים (Components)](#רכיבים-components)
5. [Hooks](#hooks)
6. [Contexts](#contexts)
7. [שירותים (Services)](#שירותים-services)
8. [Utilities](#utilities)
9. [תכונות עיקריות](#תכונות-עיקריות)
10. [מדריך לפיתוח](#מדריך-לפיתוח)

---

## סקירה כללית

**Visual IDE** הוא עורך קוד ויזואלי המאפשר כתיבת קוד Python באמצעות בלוקים גרפיים.
המערכת מבוססת על React 18 + TypeScript + Vite ומספקת ממשק אינטואיטיבי ליצירה, עריכה ומחיקה של בלוקי קוד.

### טכנולוגיות עיקריות
- **React 18** - ספריית UI
- **TypeScript** - שפת הפיתוח
- **Vite** - כלי בנייה ופיתוח
- **Tailwind CSS** - עיצוב וסטיילינג
- **Python** - שפת היעד הנוכחית (ניתן להרחבה לשxxxxxxxxxxxxxxxxxxxx

## ארכיטקטורת הפרויקט

### מבנה תיקיות

```
frontend/src/
├── components/           # כל רכיבי ה-React
│   ├── blocks/          # רכיבי בלוקים (Function, Variable, If, For, Return, FunctionCall)
│   │   └── common/      # רכיבים משותפים לבלוקים
│   ├── canvas/          # רכיב הקנבס הראשי
│   ├── common/          # רכיבים כלליים משותפים
│   ├── modals/          # מודלים ליצירה/עריכה של בלוקים
│   └── playground/      # רכיב Playground (לבדיקות)
├── contexts/            # React Contexts
├── core/               # ליבת המערכת
│   ├── interfaces/     # ממשקים
│   └── languages/      # מימושי שפות תכנות
│       └── python/     # מהדר ו-parser של Python
├── hooks/              # Custom React Hooks
├── services/           # שירותים (BlockFactory, וכו')
├── types/              # הגדרות TypeScript
└── utils/              # פונקציות עזר
```

### עקרונות עיצוב

1. **Modularity** - כל רכיב אחראי על תפקיד ספציפי אחד
2. **Reusability** - רכיבים משותפים נמצאים ב-`common/` ומשמשים את כל הבלוקים
3. **Type Safety** - שימוש נרחב ב-TypeScript לבטיחות טיפוסים
4. **Single Responsibility** - כל קובץ/רכיב עוסק בדבר אחד בלבד
5. **Composition** - בניית רכיבים מורכבים מרכיבים פשוטים יותר

---

## סוגי בלוקים

### 1. Function Block (בלוק פונקציה)
```typescript
interface FunctionBlock {
  type: 'function';
  name: string;           // שם הפונקציה
  parameters: string[];   // פרמטרים
  children: Block[];      // תוכן הפונקציה
}
```
- **צבע**: כחול (blue)
- **תומך בקינון**: כן (ניתן ליצור פונקציות בתוך פונקציות)
- **קוד Python**: `def {name}({params}):`

### 2. Variable Block (בלוק משתנה)
```typescript
interface VariableBlock {
  type: 'variable';
  name: string;    // שם המשתנה
  value: string;   // ערך (יכול להיות ביטוי)
}
```
- **צבע**: ירוק (green)
- **קוד Python**: `{name} = {value}`

### 3. If Block (בלוק תנאי)
```typescript
interface IfBlock {
  type: 'if';
  condition: string;      // תנאי
  ifBody: Block[];       // בלוקים בענף IF
  elseType: 'none' | 'elif' | 'else';  // סוג הענף השני
  elseBody: Block[];     // בלוקים בענף ELSE/ELIF
}
```
- **צבע**: סגול (purple)
- **תומך ב-elif**: כן (elseType='elif' עם IfBlock יחיד ב-elseBody)
- **קוד Python**: `if {condition}:` / `elif {condition}:` / `else:`

### 4. For Block (בלוק לולאה)
```typescript
interface ForBlock {
  type: 'for';
  iterator: string;   // משתנה הלולאה
  iterable: string;   // על מה לולאה רצה
  children: Block[];  // תוכן הלולאה
}
```
- **צבע**: כתום (orange)
- **קוד Python**: `for {iterator} in {iterable}:`

### 5. Return Block (בלוק החזרה)
```typescript
interface ReturnBlock {
  type: 'return';
  value: string;   // הערך המוחזר
}
```
- **צבע**: אדום (red)
- **קוד Python**: `return {value}`

### 6. FunctionCall Block (בלוק קריאה לפונקציה)
```typescript
interface FunctionCallBlock {
  type: 'functionCall';
  functionName: string;    // שם הפונקציה
  arguments: string[];     // ארגומנטים
}
```
- **צבע**: ציאן (cyan)
- **קוד Python**: `{functionName}({args})`

---

## רכיבים (Components)

### רכיבים משותפים לבלוקים (`components/blocks/common/`)

#### 1. `BlockContainer.tsx`
עוטף כל בלוק ומספק מסגרת, רקע וצללית.

**Props:**
- `color` - צבע המסגרת
- `children` - תוכן הבלוק
- `minWidth` - רוחב מינימלי (ברירת מחדל: 350px)

#### 2. `BlockHeader.tsx`
כותרת אחידה לכל סוגי הבלוקים.

**Props:**
- `title` - כותרת הבלוק
- `color` - צבע הכותרת
- `pythonKeyword` - מילת מפתח Python (אופציונלי)
- `onDelete` - פעולת מחיקה
- `onEdit` - פעולת עריכה מלאה
- `onToggleExpand` - פעולת הרחבה/כיווץ
- `isExpanded` - האם הבלוק מורחב

#### 3. `BlockBody.tsx`
מכיל את הילדים של בלוק (תוכן הפונקציה/לולאה/תנאי).

**Props:**
- `children` - בלוקים ילדים
- `backgroundColor` - צבע רקע
- `onAddChild` - פעולה להוספת ילד

#### 4. `BlockField.tsx`
שדה אחיד עם תווית וילדים (input/content).

**Props:**
- `label` - תווית השדה
- `labelWidth` - רוחב התווית
- `children` - תוכן השדה

#### 5. `BlockFieldList.tsx`
רשימת שדות (משמש לפרמטרים/ארגומנטים).

**Props:**
- `label` - תווית הרשימה
- `items` - רשימת פריטים
- `color` - צבע
- `onEdit` - פעולת עריכה

#### 6. `EditableField.tsx`
שדה לחיצה המציג ערך ופותח מודל בעריכה.

**Props:**
- `label` - תווית
- `value` - ערך (string או array)
- `placeholder` - placeholder
- `color` - צבע
- `onClick` - פעולה בלחיצה
- `labelWidth` - רוחב תווית

#### 7. `AddStatementMenu.tsx`
תפריט להוספת בלוקים ילדים (בתוך פונקציות/לולאות/תנאים).

**Props:**
- `onAdd` - callback עם סוג הבלוק
- `parentType` - סוג האב (קובע אילו בלוקים מותרים)

**בלוקים זמינים:**
- בתוך Function: Variable, If, For, Return, FunctionCall, Function (nested)
- בתוך If/For: Variable, If, For, Return, FunctionCall

#### 8. `CollapsedSummary.tsx`
תצוגה מצומצמת של בלוק מכווץ.

**Props:**
- `color` - צבע
- `text` - טקסט התקציר

#### 9. `IfBranchBody.tsx`
גוף ענף של תנאי (TRUE/FALSE).

**Props:**
- `branchType` - 'if' | 'else' | 'elif'
- `children` - בלוקים
- `onAddChild` - הוספת ילד
- `color` - צבע

#### 10. `FalseHandlingButton.tsx`
כפתור לבחירת סוג הענף השני (None/Elif/Else).

**Props:**
- `elseType` - סוג נוכחי
- `onChangeElseType` - callback לשינוי

---

### רכיבים כלליים (`components/common/`)

#### 1. `Modal.tsx`
מודל בסיסי לכל המודלים.

**Props:**
- `isOpen` - האם פתוח
- `onClose` - סגירת מודל
- `title` - כותרת
- `size` - גודל (sm/md/lg/xl)
- `children` - תוכן

#### 2. `ModalTextInput.tsx`
שדה קלט במודל עם תווית, placeholder והודעת עזרה.

**Props:**
- `label` - תווית
- `value` - ערך
- `onChange` - callback לשינוי
- `placeholder` - placeholder
- `hint` - הודעת עזרה
- `color` - צבע
- `autoFocus` - פוקוס אוטומטי
- `required` - שדה חובה

#### 3. `ModalActions.tsx`
כפתורי פעולה במודל (Cancel/Save).

**Props:**
- `onCancel` - ביטול
- `onSave` - שמירה
- `canSave` - האם ניתן לשמור
- `saveButtonText` - טקסט כפתור שמירה
- `color` - צבע

#### 4. `AvailableVariablesList.tsx`
רשימת משתנים זמינים בהקשר הנוכחי.

**Props:**
- `variables` - רשימת משתנים
- `onVariableClick` - לחיצה על משתנה
- `title` - כותרת (ברירת מחדל: "Available Variables")

**שימוש:**
- מוצגת במודלים בעת יצירה/עריכה
- מציגה משתנים לפי scope (גלובלי / בתוך פונקציה)
- לחיצה על משתנה מוסיפה אותו לשדה הקלט

#### 5. `TagList.tsx`
רשימת תגיות (משמש לפרמטרים/ארגומנטים).

**Props:**
- `items` - רשימת פריטים
- `onRemove` - הסרת פריט
- `color` - צבע

#### 6. `Tabs.tsx`
רכיב טאבים (משמש ב-Canvas).

**Props:**
- `activeTab` - טאב פעיל
- `onTabChange` - שינוי טאב

---

### מודלים (`components/modals/`)

כל המודלים תומכים ב-3 מצבים:
1. **create** - יצירת בלוק חדש
2. **edit** - עריכה מלאה של כל השדות
3. **edit-field** - עריכת שדה בודד

#### מודלים זמינים:
1. `VariableEditModal.tsx` - יצירה/עריכת משתנה
2. `FunctionEditModal.tsx` - יצירה/עריכת פונקציה
3. `IfEditModal.tsx` - יצירה/עריכת תנאי
4. `ForEditModal.tsx` - יצירה/עריכת לולאה
5. `ReturnEditModal.tsx` - יצירה/עריכת return
6. `FunctionCallEditModal.tsx` - יצירה/עריכת קריאה לפונקציה

**Props משותפים:**
- `isOpen` - האם המודל פתוח
- `onClose` - סגירת מודל
- `onSave` - שמירת נתונים
- `initialData` - נתונים ראשוניים (עבור edit)
- `availableVariables` - משתנים זמינים בהקשר
- `mode` - מצב (create/edit/edit-field)
- `field` - שדה ספציפי (עבור edit-field)

---

### Canvas (`components/canvas/Canvas.tsx`)

הרכיב הראשי המנהל את כל הבלוקים.

**אחריות:**
1. ניהול state של כל הבלוקים
2. הצגת בלוקים ברמה העליונה
3. ניהול מודלים ליצירה/עריכה
4. חישוב משתנים זמינים לכל בלוק/מודל
5. קומפילציה ל-Python
6. ייבוא קוד Python

**State עיקרי:**
- `blocks` - מערך הבלוקים
- `createModalType` - סוג המודל הפתוח ליצירה
- `pendingParentId` - ID של אב ממתין (עבור יצירת ילדים)
- `showCode` - האם להציג קוד
- `showImport` - האם להציג ייבוא

**פונקציות עיקריות:**
- `handleCreateXXX` - יצירת בלוק מסוג XXX
- `updateBlock` - עדכון בלוק קיים
- `deleteBlock` - מחיקת בלוק
- `addChildBlock` - הוספת בלוק ילד
- `getModalAvailableVariables` - חישוב משתנים זמינים למודל
- `handleImportCode` - ייבוא קוד Python

**חישוב משתנים זמינים:**
```typescript
// עבור מודלים (create):
const getModalAvailableVariables = (): string[] => {
  if (pendingParentId) {
    // יצירה בתוך אב - מחפש את הפונקציה האב ומחזיר את המשתנים שלה
    const parentFunction = findParent(blocks, pendingParentId);
    return getAvailableVariables(blocks, undefined, parentFunction);
  } else {
    // יצירה ברמה עליונה - מחזיר משתנים גלובליים
    return getAvailableVariables(blocks);
  }
};

// עבור בלוקים מוצגים:
blocks.map((block, index) => {
  // משתנים זמינים = כל המשתנים לפני הבלוק הנוכחי
  const blockAvailableVars = getAvailableVariables(blocks.slice(0, index));
  // ...
});
```

---

## Hooks

### 1. `useBlockManager.ts`
ניהול רשימת בלוקים ברמה העליונה.

**פונקציות:**
- `createBlock(type)` - יצירת בלוק חדש
- `addBlock(type)` - הוספת בלוק חדש לרשימה
- `updateBlock(block)` - עדכון בלוק קיים
- `deleteBlock(id)` - מחיקת בלוק
- `setBlocks(blocks)` - הגדרת רשימה חדשה
- `addBlocks(blocks)` - הוספת בלוקים לרשימה
- `clearBlocks()` - ניקוי כל הבלוקים

### 2. `useChildManager.ts`
ניהול הוספת בלוקים ילדים לתוך בלוקים הורים.

**פונקציות:**
- `addChild(blocks, parentId, blockType, blockData)` - הוספת ילד לאב
- `addChildToBlock(block, parentId, childBlock)` - רקורסיה להוספת ילד
- `addChildWithSetter(setBlocks, parentId, blockType)` - גרסה ל-useState

**תמיכה בפורמטים מיוחדים:**
- `parentId` - הוספה לתוכן בלוק רגיל
- `parentId-else` - הוספה לענף else של if block

### 3. `useModalState.ts`
ניהול state של מודלים.

---

## Contexts

### 1. `LanguageContext.tsx`
מספק גישה ל-LanguageService (כרגע Python).

**Provider:**
```typescript
<LanguageProvider service={pythonService}>
  <App />
</LanguageProvider>
```

**Hook:**
```typescript
const { languageService, languageName } = useLanguage();
```

**שימוש:**
- קומפילציה: `languageService.compile(blocks)`
- פרסור: `languageService.parse(code)`

### 2. `TabContext.tsx`
ניהול טאבים (Visual/Code).

---

## שירותים (Services)

### 1. `BlockFactory.ts`
Factory ליצירת בלוקים עם ערכי ברירת מחדל.

**פונקציות:**
- `createBlock(type)` - יצירת בלוק לפי סוג
- `createFunctionBlock()` - פונקציה
- `createVariableBlock()` - משתנה
- `createIfBlock()` - תנאי
- `createForBlock()` - לולאה
- `createReturnBlock()` - return
- `createFunctionCallBlock()` - קריאה לפונקציה
- `createBlockWithValues(type, values)` - יצירה עם ערכים מותאמים
- `cloneBlock(block)` - שכפול בלוק (כולל ילדים)
- `getDefaultValues(type)` - קבלת ערכי ברירת מחדל

### 2. `PythonLanguageService.ts`
מימוש LanguageService עבור Python.

**שיטות:**
- `compile(blocks)` - הופך בלוקים לקוד Python
- `parse(code)` - הופך קוד Python לבלוקים

**מימושים פנימיים:**
- `PythonCompiler` - קומפילציה
- `PythonParser` - פרסור

---

## Utilities

### 1. `variableUtils.ts`
פונקציות לחישוב משתנים זמינים בהקשר.

#### `getAvailableVariables(blocks, currentBlockId?, parentFunction?)`
מחזירה רשימת משתנים זמינים בהקשר הנוכחי.

**לוגיקה:**
1. אם יש `parentFunction` - מוסיף את הפרמטרים שלה
2. עובר על כל הבלוקים עד `currentBlockId` (אם צוין)
3. אוסף:
   - שמות משתנים מ-VariableBlock
   - iterators מ-ForBlock
   - משתנים מתוך ילדים (רקורסיבית)
4. מסיר כפילויות ומחזיר

**דוגמה:**
```typescript
// משתנים ברמה גלובלית
const vars1 = getAvailableVariables(blocks);

// משתנים בתוך פונקציה
const vars2 = getAvailableVariables(blocks, undefined, functionBlock);

// משתנים עד בלוק מסוים
const vars3 = getAvailableVariables(blocks, 'block-123');
```

#### `getVariablesInFunction(functionBlock)`
מחזירה את כל המשתנים בתוך פונקציה (כולל פרמטרים).

---

## תכונות עיקריות

### 1. **משתנים זמינים לפי Scope** (Available Variables)

#### תיאור
כל בלוק/מודל מציג רשימה של משתנים זמינים בהקשר שלו.

#### כללים:
- **Scope גלובלי**: משתנים שהוגדרו לפני הבלוק הנוכחי
- **Scope של פונקציה**: פרמטרים + משתנים גלובליים + משתנים מקומיים
- **Scope של לולאה**: iterator + משתנים זמינים ברמה הקודמת

#### מימוש:
1. **במודלים (create)**:
   ```typescript
   const availableVars = getModalAvailableVariables();
   <VariableEditModal availableVariables={availableVars} ... />
   ```

2. **בבלוקים מוצגים**:
   ```typescript
   blocks.map((block, index) => {
     const blockAvailableVars = getAvailableVariables(blocks.slice(0, index));
     return <VariableBlock availableVariables={blockAvailableVars} ... />;
   });
   ```

3. **בעריכת שדה**:
   ```typescript
   <AvailableVariablesList
     variables={availableVariables}
     onVariableClick={(variable) => setValue(value + (value ? ' ' : '') + variable)}
   />
   ```
   - לחיצה על משתנה מוסיפה אותו לשדה הקלט
   - אם יש ערך קודם, מוסיף רווח לפני

### 2. **עריכת שדה בודד** (Field Editing)

#### תיאור
ניתן לערוך כל שדה בנפרד ללא פתיחת מודל מלא.

#### מימוש:
```typescript
const [editModalState, setEditModalState] = useState<{
  open: boolean;
  field: 'name' | 'value';
} | null>(null);

// פתיחת עריכת שדה
<EditableField
  onClick={() => setEditModalState({ open: true, field: 'value' })}
  ...
/>

// מודל עם mode='edit-field'
<VariableEditModal
  mode="edit-field"
  field={editModalState?.field}
  ...
/>
```

### 3. **הרחבה/כיווץ של בלוקים** (Expand/Collapse)

#### תיאור
בלוקים עם תוכן (Function, If, For) ניתנים להרחבה/כיווץ.

#### מימוש:
```typescript
const [isExpanded, setIsExpanded] = useState(true);

// כפתור בכותרת
<BlockHeader
  onToggleExpand={() => setIsExpanded(!isExpanded)}
  isExpanded={isExpanded}
  ...
/>

// הצגת תוכן או תקציר
{isExpanded ? (
  <BlockBody>{children}</BlockBody>
) : (
  <CollapsedSummary text="..." />
)}
```

### 4. **פונקציות מקוננות** (Nested Functions)

#### תיאור
ניתן ליצור פונקציות בתוך פונקציות (Python תומך בזה).

#### מימוש:
1. **AddStatementMenu** כולל אפשרות "Function"
2. **handleCreateFunction** בודק אם יש `pendingParentId`
3. אם כן - מוסיף כילד, אם לא - מוסיף ברמה עליונה

### 5. **ייבוא וייצוא קוד** (Import/Export)

#### תיאור
- **ייצוא**: הצגת קוד Python מקומפל
- **ייבוא**: פרסור קוד Python לבלוקים

#### מימוש:
```typescript
// ייצוא
const code = languageService.compile(blocks);

// ייבוא
const handleImportCode = () => {
  const parsedBlocks = languageService.parse(importCode);
  setBlocks(parsedBlocks);
};
```

### 6. **If/Elif/Else**

#### תיאור
תמיכה מלאה ב-if, elif (שרשור), else.

#### מימוש:
- **elseType='none'**: אין ענף שני
- **elseType='else'**: יש ענף else
- **elseType='elif'**: יש elif (elseBody חייב להכיל IfBlock אחד בדיוק)

```typescript
<FalseHandlingButton
  elseType={block.elseType}
  onChangeElseType={(newType) => {
    // עדכון elseType ו-elseBody בהתאם
  }}
/>
```

---

## מדריך לפיתוח

### הוספת סוג בלוק חדש

1. **הגדרת הטיפוס ב-`types/blocks.ts`**:
   ```typescript
   export interface NewBlock extends BaseBlock {
     type: 'newBlock';
     field1: string;
     field2: number;
   }

   export type Block = ... | NewBlock;
   ```

2. **הוספה ל-BlockFactory**:
   ```typescript
   static createNewBlock(id?: string): NewBlock {
     return {
       id: id || this.generateId('newBlock'),
       type: 'newBlock',
       field1: 'default',
       field2: 0,
     };
   }
   ```

3. **יצירת רכיב הבלוק ב-`components/blocks/`**:
   ```tsx
   export const NewBlock: React.FC<NewBlockProps> = ({ block, onUpdate, onDelete }) => {
     return (
       <BlockContainer color="blue">
         <BlockHeader title="New Block" color="blue" onDelete={onDelete} />
         {/* שדות... */}
       </BlockContainer>
     );
   };
   ```

4. **יצירת מודל ב-`components/modals/`**:
   ```tsx
   export const NewBlockEditModal: React.FC<...> = ({ ... }) => {
     return (
       <Modal isOpen={isOpen} onClose={onClose} title="Create New Block">
         <ModalTextInput label="Field 1" ... />
         <ModalActions ... />
       </Modal>
     );
   };
   ```

5. **שילוב ב-Canvas**:
   ```typescript
   // הוספת כפתור
   const addNewBlock = () => setCreateModalType('newBlock');

   // הוספת handler
   const handleCreateNewBlock = (data) => { ... };

   // הוספת מודל
   <NewBlockEditModal
     isOpen={createModalType === 'newBlock'}
     onSave={handleCreateNewBlock}
     ...
   />

   // הוספת rendering
   case 'newBlock':
     return <NewBlock key={block.id} block={block} ... />;
   ```

6. **עדכון Compiler ב-`core/languages/python/pythonCompiler.ts`**:
   ```typescript
   case 'newBlock':
     return `# New block: ${block.field1}`;
   ```

7. **עדכון Parser ב-`core/languages/python/pythonParser.ts`**:
   ```typescript
   // הוספת לוגיקת פרסור
   ```

### הוספת שפה חדשה

1. **יצירת ממשק ב-`core/languages/`**:
   ```
   languages/
   └── javascript/
       ├── javascriptCompiler.ts
       ├── javascriptParser.ts
       └── JavaScriptLanguageService.ts
   ```

2. **מימוש LanguageService**:
   ```typescript
   export class JavaScriptLanguageService implements LanguageService {
     readonly name = 'JavaScript';

     compile(blocks: Block[]): string { ... }
     parse(code: string): Block[] { ... }
   }
   ```

3. **שילוב ב-App**:
   ```tsx
   const jsService = new JavaScriptLanguageService();

   <LanguageProvider service={jsService}>
     <App />
   </LanguageProvider>
   ```

### הנחיות כתיבת קוד

1. **TypeScript**:
   - השתמש בטיפוסים מפורשים
   - הימנע מ-`any`
   - הגדר interfaces לכל Props

2. **רכיבים**:
   - רכיב אחד לקובץ
   - JSDoc לרכיבים מורכבים
   - Props interface מעל הרכיב

3. **Naming**:
   - רכיבים: PascalCase
   - פונקציות: camelCase
   - קבועים: UPPER_SNAKE_CASE
   - קבצים: PascalCase (רכיבים), camelCase (utilities)

4. **Structure**:
   - imports
   - types/interfaces
   - רכיב ראשי
   - רכיבי עזר (אם יש)
   - export

---

## שינויים אחרונים

### גרסה נוכחית (2025-10-07)

#### תכונות שנוספו:
1. **Available Variables בכל המודלים**
   - חישוב משתנים זמינים לפי scope
   - הצגה במודלים create + edit
   - לחיצה על משתנה מוסיפה אותו לשדה

2. **Nested Functions**
   - תמיכה בפונקציות בתוך פונקציות
   - AddStatementMenu כולל "Function"

3. **רפקטורינג מודולריות**
   - יצירת 5 רכיבים משותפים
   - הסרת ~400+ שורות קוד כפול
   - BlockContainer, BlockHeader, BlockBody, BlockField, BlockFieldList

4. **שיפורי UI**
   - EditableField עם עיצוב pill
   - כפתור FalseHandlingButton לבחירת else/elif
   - הרחבה/כיווץ של בלוקים

#### תיקוני באגים:
1. תיקון רוחב בלוקים (BlockBody min-width)
2. תיקון הוספת משתנים בשדה ערך (רווח במקום "+")

---

## סיכום

**Visual IDE** הוא מערכת מודולרית ומאורגנת היטב לעריכה ויזואלית של קוד Python.
המערכת בנויה עם דגש על:
- **ארכיטקטורה נקייה** - הפרדה בין שכבות
- **רכיבים ניתנים לשימוש חוזר** - הימנעות מקוד כפול
- **Type Safety** - שימוש נכון ב-TypeScript
- **חוויית משתמש** - ממשק אינטואיטיבי ונוח

המערכת תומכת בהרחבה קלה לשxxxxxxנות נוספות ולסוגי בלוקים חדשים.
