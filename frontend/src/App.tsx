import { Canvas } from './components/canvas/Canvas';
import { LanguageProvider } from './contexts/LanguageContext';
// import { Playground } from './components/playground/Playground';
// import { Tabs } from './components/common/Tabs';
// import { TabProvider, useTab } from './contexts/TabContext';

// Simplified App - removed Playground tab for now
function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Canvas />
      </div>
    </LanguageProvider>
  );
}

export default App;