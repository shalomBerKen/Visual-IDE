import { Canvas } from './components/canvas/Canvas';
import { Playground } from './components/playground/Playground';
import { Tabs } from './components/common/Tabs';
import { TabProvider, useTab } from './contexts/TabContext';

function AppContent() {
  const { activeTab } = useTab();

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs />
      {activeTab === 'main' ? <Canvas /> : <Playground />}
    </div>
  );
}

function App() {
  return (
    <TabProvider>
      <AppContent />
    </TabProvider>
  );
}

export default App;