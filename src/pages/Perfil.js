import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  theme,
  Container,
} from "@chakra-ui/react";
import styles from "./styles.js";
import Menu from "../pages/Menu";
import axios from 'axios';


const apiUrl = 'https://iacademy-api.azurewebsites.net';


function Perfil() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState(null); 
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");



  useEffect(() => {
    // Use userId para buscar as informações do usuário da API assim que a página for carregada
    const buscarInformacoesUsuario = async () => {
      try {
        
        const token = localStorage.getItem("token", token);
        const response = await axios.get(`${apiUrl}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserId(response.data.id || "");
        setNomeCompleto(response.data.nomeCompleto || "");
        setCnpj(response.data.cnpj || "");
        setEmail(response.data.email || "");
  
      } catch (error) {
        console.error('Erro ao buscar informações do usuário', error);
      }
    };
  
    // Certifique-se de que userId e token sejam válidos antes de fazer a solicitação
    if (userId && token) {
      buscarInformacoesUsuario();
    }
  }, [userId, token]);

  const atualizarCadastroUsuario = async () => {
    // Construa o objeto de dados que será enviado para a API
    if (!nomeCompleto || !cnpj || !email) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    // Verifique se as senhas coincidem
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    const dadosUsuario = {
      nomeCompleto,
      email,
      senha, 
    };
  
    try {
      
      const resposta = await axios.put(`${apiUrl}/api/user/${userId}`, dadosUsuario, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      
      alert('Perfil atualizado com sucesso');
      
      setNomeCompleto("");
      setCnpj("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

    } catch (erro) {
      
      console.error('Erro ao atualizar o perfil', erro);
  
    
      if (erro.response) {
        console.error('Erro da API:', erro.response.data);
      } else {
        console.error('Erro de rede:', erro.message);
      }
    }
  };



  return (
    <>
      <Menu />
      <Container maxWidth="container.xl" flex="1">
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box
            w="150px"
            position="fixed"
            left="0"
            zIndex="999"
            top="0"
            bottom="0"
          >
            <Menu />
          </Box>
          <Box
            p={"3rem"}
            borderWidth={5}
            borderRadius="md"
            boxShadow="lg"
            w="60rem"
            rowGap={"1rem"}
            color="white"
            alignItems="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            overflow={"auto"}
            bg={"black"}

          >
            <Heading as="h1" size="xl" mb="6">
              Perfil do Usuário
            </Heading>
            {erro && (
              <Alert status="error" mb="4">
                <AlertIcon />
                <AlertTitle mr={2}>{erro}</AlertTitle>
              </Alert>
            )}
            <FormControl id="nomeCompleto" isRequired>
              <FormLabel>Nome Completo</FormLabel>
              <Input
                type="text"
                placeholder="Seu nome completo"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                variant="filled"
              />
            </FormControl>
            <FormControl id="cnpj" isRequired>
              <FormLabel>CNPJ da Empresa</FormLabel>
              <Input
                type="text"
                placeholder="CNPJ da sua empresa"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                variant="filled"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="filled"
              />
            </FormControl>
            <FormControl id="password" mb="2">
              <FormLabel>Nova Senha</FormLabel>
              <Input
                type="password"
                placeholder="Nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                variant="filled"
              />
            </FormControl>
            <FormControl id="confirmPassword" mb="2">
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <Input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                variant="filled"
              />
            </FormControl>
            <Button
              colorScheme="teal"
              size="md"
              width="30%"
              mt={4}
              bg={styles.colors.botao}
              onClick={atualizarCadastroUsuario}
            >
              Salvar Alterações
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Perfil;
