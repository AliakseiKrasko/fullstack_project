import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'  // ✅ добавляем
import './index.css'
import App from './App'
import { store } from './app/store.ts'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>      {/* ✅ вот эта обёртка */}
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)