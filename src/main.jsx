import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { MapProvider } from './stores/mapStore.js'
import './index.css'
import { ToolModeProvider } from './stores/toolMode.js'

createRoot(document.getElementById('root')).render(
    <ToolModeProvider>
        <MapProvider>
            <App />
        </MapProvider>
    </ToolModeProvider>
)