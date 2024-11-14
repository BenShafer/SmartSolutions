import { Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useMode, ThemeContext } from './theme';
import Topbar from "./components/Topbar";
import Dashboard from './routes/Dashboard';
import Correlations from './routes/Correlations';
import Forecast from './routes/Forecast';

function App() {
  const [theme, colorMode] = useMode();
  const { pathname } = useLocation();

  return (
    <ThemeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Topbar pathname={pathname} />
          <main className="main">
              <Routes>          
                <Route index path="/" element={<Dashboard />}/>
                <Route path="correlations" element={<Correlations />}/>
                <Route path="forecast" element={<Forecast />}/>                
              </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
