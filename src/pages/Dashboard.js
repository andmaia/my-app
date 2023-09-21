import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useMediaQuery
} from '@chakra-ui/react';
import * as axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import ImgC from "../img/csharp_logo.png";
import Menu from './Menu';

//ContextoApi para poder compartilhar funções entre todos os recursos da minha api
const DashboardContext = createContext();

function DashboardProvider({ children }) {
  const navigate = useNavigate();
  const [isSmOrMd] = useMediaQuery("(max-width: 108em)");

  
  function RedirecionaParaConteudoPorIdSumarioMatriculado(idSumario) {
    navigate("/conteudo/" + idSumario)
  }

  const [idSumarioMatriculado, setIdSumarioMatriculado] = useState("")


  async function SolicitarListaCursosDisponiveis() {
    try {
      const response = await axios.get(
        "https://iacademy-api.azurewebsites.net/api/summary/owner/iacademy?isAvailable=true"
      );
      if (response && response.data) {
        const dados = response.data;
        return dados;
      } else {
        return [];
      }
    } catch (error) {
      console.log("Erro ao pegar cursos do banco")
      throw error;
    }

  }


  async function SolicitarListaCursosMatriculados() {
    try {
      const response = await axios.get(
        "https://iacademy-api.azurewebsites.net/api/summary/owner/74f364ab-a0c2-4d30-9ec9-9cc1c440c29d?isAvailable=true"
      );
      if (response.status === 200 && response.data) {
        const dados = response.data;
        return dados;
      } else if (response.status === 404) {
        return console.log("Devia retornar algo aqui");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function matricularEmCursos(idSumario) {
      try {

        const apiUrl = "https://iacademy-api.azurewebsites.net/api/summary/enroll";

        const obj = {
          "summaryId": idSumario,
          "ownerId": "74f364ab-a0c2-4d30-9ec9-9cc1c440c29d"
        }

        const response = await axios.post(apiUrl, obj, {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
          },
        });

        if (response.status === 200) {
          const novoIdSumarioMatriculado = response.data;
          console.log(novoIdSumarioMatriculado)
          return novoIdSumarioMatriculado
        } else {
          throw new Error(`Erro ao criar o novo id de sumário`);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    //Essa função verifica uma lista de todos os cursos que a plataforma oferece, e todos os cursos que o usuário atual está
    //matriculado, e retorna no dashboard os cursos dispniveis que o usuário não esta matriculado
  
    function verificarSincronizaçãoDeCursos(listaTodosCursosCadastradados, listaCursosMatriculados) {
      const cursosDisponiveisNaoIniciados = listaTodosCursosCadastradados.filter(cursoDisponivel => {
        return !listaCursosMatriculados.some(cursoIniciado => cursoIniciado.theme === cursoDisponivel.theme);
      });
      return cursosDisponiveisNaoIniciados;
    }


    return (
      <DashboardContext.Provider value={{
        matricularEmCursos,
        SolicitarListaCursosDisponiveis,
        SolicitarListaCursosMatriculados,
        verificarSincronizaçãoDeCursos,
        RedirecionaParaConteudoPorIdSumarioMatriculado,
        idSumarioMatriculado,
        isSmOrMd
      }}>
        {children}
      </DashboardContext.Provider>
    )
  }
  //Função para você pode importar os intes de contexto
  function useDashboardContext() {
    const context = useContext(DashboardContext);
    if (!context) {
      throw new Error('useDashboardContext deve ser usado dentro de um DashboardProvider');
    }
    return context;
  }


  const CardComponentCursosDisponiveis = ({ obj }) => {
    //Importo as funções que vou precisar do contextApi
    const { idSumarioMatriculado,isSmOrMd, matricularEmCursos, RedirecionaParaConteudoPorIdSumarioMatriculado } = useDashboardContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const svgIcon = obj.icon;
    return (
      <Card
      flexDir={"row"}
      overflow="hidden"
      w='45rem'
      h="10rem"
      bg="#1A1922"
      mb={5}
      >
          <Image
          objectFit='fill'
          w="150px"
          h="150px"
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`}
          mr={4}
          bg="white"
          style={{ borderRadius: '5' }} 
      />
        <Stack
           bg="#262734"
           color="white"
           direction="row"
           alignItems="flex-start"
           w='100%'
        >
          <CardBody p={"1rem"}>
            <Heading size="md">{obj.theme}</Heading>
            <Text py="2" fontSize="13px" whiteSpace={'nowrap'} >
              {obj.category}-{obj.subcategory}
            </Text>
          </CardBody>

          <Button
              variant="solid"
              bg="#0880A2"
              m={5}
              colorScheme="blue"
              size="lg"
              alignSelf="flex-end"
              w="5.6rem"
              
            onClick={async () => {
              //No botão de cursos disponiveis, eu verifico o id do usuário criado atraves do login/cadsatro
              //ao ele iniciar um curso, chamo a função de matricula e passo o id dele, espero ela retornar o true
              //em seguida se der tudo certo redireciono ele para a tela de conteudo
              try {
                console.log(obj.id)
                const idSumario = await matricularEmCursos(obj.id);
                RedirecionaParaConteudoPorIdSumarioMatriculado(idSumario);
              } catch (error) {
                console.error("Erro ao matricular e redirecionar:", error);
              }
            }}            
          >
            Começar
          </Button>

          {/*Botão que ao clicar, renderiza um modal com os detalhes do curso */}
          <Button  
          variant="solid"
          bg="#0880A2"
          m={5}
          colorScheme="blue"
          size="lg"
          alignSelf="flex-end"
          w="6.5em"
          onClick={() => { 
            onOpen() }}
        
          >
            ver detalhes
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent color='white' bg="#262734">
              <ModalHeader>Detalhes do treinamento</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {obj.topics.map((item, index) => {
                  return (
                    <div key={index}>
                      <Text fontSize="15px" fontWeight='bold'>{item.index}-{item.title}</Text>
                      <Text ml='5px' fontStyle='italic'>{item.description}</Text>
                    </div>
                  );
                })}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Stack>
      </Card>
    );
  };

  const CardComponentCursoIniciado = ({ curso }) => {
    //Solicito as funções e variáveis que preciso do context
    const {isSmOrMd,RedirecionaParaConteudoPorIdSumarioMatriculado} = useDashboardContext();
    
    const svgIcon = curso.icon;

    return (
      <Card
      flexDirection="row"
      w='45rem'
      h="10rem"
      overflow="auto"
      p={3}
      bg="#262734"
      color="white"
      mr={"4rem"}
      >
       <Image
          objectFit='cover'
          src={ImgC}
          bg="white"
          borderRadius='5'
          alignSelf={"center"}
          h="130px"
          w="150px"
          mr="20px"
      /> 
        <Stack flexDir="column"  justifyContent="space-between">
          <Flex justifyContent="space-between" gap={20} alignItems="flex-start">
            <Flex flexDir='column' justifyContent='flex-start'>
              <Text fontSize='15px' fontWeight='bold'>{curso.theme}</Text>
              <Box gap='10px' display='flex' flexDir='row' alignItems='center' justifyContent='center'>
                <Text>{curso.subcategory}</Text>
                -
                <Text>{curso.category}</Text>
              </Box>
            </Flex>

            <Button
               p={3}
               variant="solid"
               colorScheme="#0880A2;"
               size="lg"
             onClick={
              ()=>{
                RedirecionaParaConteudoPorIdSumarioMatriculado(curso.id)
              }}
            >
              Continuar de onde parou
            </Button>
          </Flex>
          <Flex alignItems="center" gap="10px" justifyContent="space-between">
            <Text fontSize="10px">{20}%</Text>

            <Progress
              colorScheme="whiteAlpha"
              size="md"
              h="2px"
              value={20}
              flex="1"
              mr={2}
              bg="grey"
            />
          </Flex>
        </Stack>

      </Card>
    );
  };


// Componente de paginação que contém os cursos disponíveis
const PaginationComponent = ({ items }) => {
  // Define a quantidade de itens por página
  const cardsPerPage = 3;
  // Pagina atual que o usuário está selecionando
  const [currentPage, setCurrentPage] = useState(1);
  // Divide e arredonda o número total de itens na lista pelo número de itens por página pré definido
  const lastPageIndex = Math.ceil(items.length / cardsPerPage);

  // Função de auxílio para mudar a página atual
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // Função para renderizar os "cards" da página atual
  const renderCards = () => {
    // Calcula o índice de início e fim dos "cards" a serem exibidos na página atual
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    // Retorna uma array de componentes "cards" com base nos índices calculados
    return items
      .slice(startIndex, endIndex)
      .map((item, index) => (
        <CardComponentCursosDisponiveis
          obj={item}
          key={index}
        />
      ));
  };

  return (
    <div>
      {/* Renderiza os "cards" da página atual em uma caixa */}
      <Box h="70vh">{renderCards()}</Box>

      {/* Renderiza os botões de paginação */}
      <Flex direction="row" justifyContent="center">
        <Stack direction="row" spacing={2} mb={4}>
          {/* Cria um botão para cada página disponível */}
          {Array.from({ length: lastPageIndex }, (_, index) => (
            <Button
              key={index}
              size="sm"
              // Define a cor do botão com base na página atual
              colorScheme={currentPage === index + 1 ? 'blue' : 'gray'}
              // Ao clicar em um botão, chama a função handlePageChange para atualizar a página atual
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </Stack>
      </Flex>
    </div>
  );
};


  function DashboardBody() {
    const [isSmOrMd] = useMediaQuery("(max-width: 100em)");

    //Solicito as funções e variaveis que necessito do context
    const { SolicitarListaCursosDisponiveis, SolicitarListaCursosMatriculados, verificarSincronizaçãoDeCursos } = useDashboardContext();

    //Variáveis de estado que são listas que sofrerão tratamentos antes de renderizar na tela
    const [listaCursosNaoMatriculadosParaRenderizar, setListaCursosNaoMatriculadosParaRenderizar] = useState([]);
    const [listaCursosMatriculadosParaRenderizar, setListaCursosMatriculadosParaRenderizar] = useState([])


    //Quando o usuário entra na tela, eu chamo uma vez por renderização para inicializar as listas
    useEffect(() => {
      const fetchData = async () => {


        //Solicita todo os cursos disponíveis do id padrõa IAcademy
        const listaTodosOsCursosDisponiveisRetornado = await SolicitarListaCursosDisponiveis();
        //Solicita todo os cursos disponíveis do id do usuário atual
        const listaCursosMatriculados = await SolicitarListaCursosMatriculados();

        //Manda a lista dos cursos do usuário para renderizar
        setListaCursosMatriculadosParaRenderizar(listaCursosMatriculados)
        setListaCursosNaoMatriculadosParaRenderizar(listaTodosOsCursosDisponiveisRetornado)
        //Verifica se o usuário não está matriculado em nenhum curso ainda
        

       /* if(listaCursosMatriculados===undefined){
          //caso não esteja matriculadom,a função verificarSincronicaçaoDeCursos irá filtrar uma lista vazia
          //portanto não filtrando nenhum curso e retornando todos
          const listaCursosNaoMatriculados = await verificarSincronizaçãoDeCursos(listaTodosOsCursosDisponiveisRetornado,[]);
          setListaCursosNaoMatriculadosParaRenderizar(listaCursosNaoMatriculados)
        }else{
          //Caso ele tenha sido matriculado em algum curso,a  função verificarSincronicaçaoDeCursos irá filtrar a
          //listaDeCursos matriculados, e irá renderizar na tela na aba cursosDisponiveis apenas os cursos que o usuario
          //não está matriculado
          const listaCursosNaoMatriculados = await verificarSincronizaçãoDeCursos(listaTodosOsCursosDisponiveisRetornado,listaCursosMatriculados);
          setListaCursosNaoMatriculadosParaRenderizar(listaCursosNaoMatriculados)
        } */

      };

      fetchData();
    }, []);

    //Enquanto o useEffect faz as requisições e renderiza, as lista estarão vazias, portanto, 
    //verifico se as listas para renderizar ainda estão sem conteudo, e caso estejam
    //renderizo na tela um 'skelleton', componente do chakra ui.
    if (listaCursosNaoMatriculadosParaRenderizar.length === 0 && listaCursosMatriculadosParaRenderizar.length===0 ) {
      return (

        <Container maxWidth="container.xl" flex="1" >
          <Center>
            <Heading as="h1" size="lg"  fontSize={"78px"}>
              Dashboard
            </Heading>
          </Center>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={9}
            justifyContent="center"
            alignItems="flex-start"
            mx="auto"
            px={4}
          >
            <Stack>
              <Skeleton height='60vh' />

            </Stack>
            <Stack>
              <Skeleton height='60vh' />

            </Stack>

          </Grid>
        </Container>
      )
    }


          
          return (
          <Container flex="1" ml={isSmOrMd ? "7rem" : "center" } justifyItems={"center"}>
            <Center>
              <Heading as="h1" size="lg" my="10"  fontSize={"68px"} ml="18rem">
                Dashboard
              </Heading>
            </Center>
     
        <Flex
          flexDir={isSmOrMd? 'column' : 'row'}
          mt={{ base: '7rem', lg: '2rem' }}
          w={"100%"}
          justifyContent={"center"}
          rowGap={isSmOrMd ? "5rem" : "0"}
          alignSelf={"center"}
        >
             <VStack alignItems="center" w="50rem">
              <Heading as="h2" size="lg" mb="2">
                Treinamentos em andamento
              </Heading>
            {/*verifica se o usuario ainda não possui cursos matriculados, cajo não esteja, mapea a lista, e adiciona 
            os daos dentro de um componente cardComponenteInciado para renderizar na tela. Caso ele ainda não possua cursos
            ele irá retornar um text */}
            {listaCursosMatriculadosParaRenderizar!==undefined?listaCursosMatriculadosParaRenderizar.map((curso, index) => (
              <CardComponentCursoIniciado
                key={index}
                curso={curso}
              />
            )):<Text>Você ainda não esta matriculado em algum treinamento</Text>}

          </VStack>


          <VStack w="full" alignItems="flex-start">
            <Flex  flexDir="column"
          alignItems="flex-start"
          w="100%"
          >
              <Heading as="h2" size="lg" mb="1rem" mr={'340px'} whiteSpace={'nowrap'}>
                Treinamentos Disponíveis
              </Heading>
              <Flex w="50rem" justifyContent="flex-start" gap={"1rem"}>
                <Input
                  variant="filled"
                  size="lg"
                  border="none"
                  mr={3}
                  borderRadius={5}
                  borderColor="#0880A2"
                  mb="1rem"
                  w={'35rem'}
                />
                <Button bg="#0880A2" color="white" size="lg" borderRadius={12}>
                  Pesquisar
                </Button>
              </Flex>
            </Flex>
            <Flex w="100%">
              {/*Manda a lista filtrada dos cursos disponiveis e manda para o compoente de paginação */}
              <PaginationComponent items={listaCursosNaoMatriculadosParaRenderizar} />
            </Flex>
          </VStack>


        </Flex>
      </Container>
    );
  }


  function Dashboard() {
    return (
      <DashboardProvider>
        <Menu />
        <DashboardBody />
      </DashboardProvider>
    )
  }

  export default Dashboard;