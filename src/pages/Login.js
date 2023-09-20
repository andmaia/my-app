import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Heading,
  Input,
  Button,
  Container,
  FormControl,
  FormLabel,
  Link,
  Text,
} from "@chakra-ui/react";
import styles from './styles.js';

const apiUrl = 'https://iacademy-api.azurewebsites.net';


function Login() {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    
    // Verifique se os campos de email e senha não estão vazios
    if (!formData.email || !formData.password) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      // Envie as informações de login para a API e inclua o token no cabeçalho
      const response = await axios.post(`${apiUrl}/api/user/login`, formData);

      // A API deve retornar um token se o login for bem-sucedido
      const token = response.data.token;

      // Verifique se o token não está vazio antes de armazená-lo
      if (token) {
        // Armazene o token em algum lugar seguro, como no armazenamento local (localStorage) ou em um estado global (Redux)
        localStorage.setItem("token", token);

        // Redirecione para a página de dashboard após o login
        navigate("/dashboard");
      } else {
        setError("Credenciais inválidas. Tente novamente.");
      }
    } catch (error) {
      // Lida com erros de login, como credenciais inválidas
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <Container
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bg={styles.colors.background}
      justifyContent="center"
      alignItems="center"
    >

      <Box p={9}
        borderWidth={1}
        borderRadius="md"
        boxShadow="lg"
        w="40rem"
        h="35rem"
        rowGap={"2rem"}
        color="white"
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignSelf="center"
        bg={"black"}
      >
        <Heading as="h1" size="xl" mb="4">Login</Heading>

        {error && <Text color="red.500">{error}</Text>}

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Seu e-mail"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            variant="filled"

          />
        </FormControl>

        <FormControl id="password" mt={2} isRequired mb="3">
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            placeholder="Sua senha"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            variant="filled"
          />
        </FormControl>

        <Button onClick={handleLogin} colorScheme="teal" width="30%" bg={styles.colors.botao}>
          Entrar
        </Button>
        <Link onClick={() => navigate("/cadastro")}>
          Não tem uma conta? Cadastre-se aqui
        </Link>
      </Box>
    </Container>
  );
}

export default Login;
