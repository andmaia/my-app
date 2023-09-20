import React from "react";
import { ChakraProvider, CSSReset,Flex,Box,Text} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from './pages/Cadastro';
import Dashboard from "./pages/Dashboard";
import Menu from './pages/Menu';
import Perfil from './pages/Perfil';
import Conteudo from './pages/Conteudo';
import Feedback from "./pages/feedback/Feedback"
import Pendencias from "./pages/Pendencias"
function App() {
  return (
    <ChakraProvider>
    <CSSReset />
    <Router>
      <Flex minH="100vh" bg="#1A1922" color="white">
     
        <Flex minW="100%" flexDir="row" justifyContent='space-between'>       
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/conteudo/:id" element={<Conteudo />} />
            <Route path="/feedback/:id" element={<Feedback />} />
            <Route path="/pendencias/:id" element={<Pendencias />} />
          </Routes>
        </Flex>
      </Flex>
    </Router>
  </ChakraProvider>
  );
}

export default App;
