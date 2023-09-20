import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import styles from './styles.js';
import axios from 'axios';


const apiUrl = 'https://iacademy-api.azurewebsites.net';

function Cadastro() {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cnpj: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    nomeCompleto: "",
    cnpj: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // Verifique se os campos obrigatórios não estão vazios
    const errors = {};
    let hasErrors = false;

    if (!formData.nomeCompleto.trim()) {
      errors.nomeCompleto = "Campo obrigatório";
      hasErrors = true;
    }

    if (!formData.cnpj.trim()) {
      errors.cnpj = "Campo obrigatório";
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      errors.email = "Campo obrigatório";
      hasErrors = true;
    }

    if (!formData.password.trim()) {
      errors.password = "Campo obrigatório";
      hasErrors = true;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
      hasErrors = true;
    }

    setFormErrors(errors);

    if (!hasErrors) {
      try {
        // Envie os dados para a API usando o método POST
        const response = await axios.post(`${apiUrl}/api/user`, formData);

        // Verifique a resposta da API para manipular o resultado
        if (response.status === 201) {
          console.log("Cadastro realizado com sucesso!");
          // Redirecione o usuário para outra página após o cadastro
          let token = response.data.token;
          localStorage.setItem('token', token);
          navigate("/");
        } else {
          console.error("Erro ao cadastrar o usuário:", response.data);
        }
      } catch (error) {
        console.error("Erro ao cadastrar o usuário:", error);
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      minWidth="100%"
      bg={styles.colors.background}
      justifyContent={"center"}
      alignItems={"center"}
    >

      <Box
        p={5}
        borderWidth={1}
        borderRadius="md"
        boxShadow="lg"
        w="45rem"
        h="55rem"
        rowGap={"1.5rem"}
        color="white"
        display="flex"
        flexDirection="column"
        bg={"black"}
        alignItems="center"
        alignSelf={"center"}
      >
        <Heading as="h1" size="xl" mb="6">
          Cadastro
        </Heading>
        <FormControl id="nomeCompleto" isRequired mb="2">
          <FormLabel>Nome Completo</FormLabel>
          <Input
            type="text"
            name="nomeCompleto"
            placeholder="Seu nome completo"
            onChange={handleInputChange}
            variant="filled"

          />
          {formErrors.nomeCompleto && (
            <Text color="red.500">{formErrors.nomeCompleto}</Text>
          )}
        </FormControl>
        <FormControl id="cnpj" isRequired mb="2">
          <FormLabel>CNPJ da Empresa</FormLabel>
          <Input
            type="text"
            name="cnpj"
            placeholder="CNPJ da sua empresa"
            onChange={handleInputChange}
            variant="filled"

          />
          {formErrors.cnpj && <Text color="red.500">{formErrors.cnpj}</Text>}
        </FormControl>
        <FormControl id="email" isRequired mb="2">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            onChange={handleInputChange}
            variant="filled"

          />
          {formErrors.email && <Text color="red.500">{formErrors.email}</Text>}
        </FormControl>
        <FormControl id="password" isRequired mb="2">
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Sua senha"
            onChange={handleInputChange}
            variant="filled"

          />
          {formErrors.password && (
            <Text color="red.500">{formErrors.password}</Text>
          )}
        </FormControl>
        <FormControl id="confirmPassword" isRequired mb="2">
          <FormLabel>Confirmar Senha</FormLabel>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar senha"
            onChange={handleInputChange}
            variant="filled"

          />
          {formErrors.confirmPassword && (
            <Text color="red.500">{formErrors.confirmPassword}</Text>
          )}
        </FormControl>
        <Button
          colorScheme="teal"
          size="md"
          width="30%"
          mt={4}
          bg={styles.colors.botao}
          onClick={handleSubmit}
        >
          Cadastrar
        </Button>
        <Button
          onClick={() => navigate("/")}
          colorScheme="transparent"
          size="md"
          width="30%"
          mt={2}
          borderWidth={1}
        >
          Voltar
        </Button>
      </Box>
    </Box>
  );
}

export default Cadastro;
