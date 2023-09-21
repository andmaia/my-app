import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Skeleton,
  Text,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AiOutlineDown, AiOutlineEdit } from "react-icons/ai";
import { BiHistory } from "react-icons/bi";
import { BsBookHalf } from "react-icons/bs";
import { FaClipboardList, FaPencilAlt } from 'react-icons/fa';
import { RiMenuFoldFill } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import imgTeste from '../img/csharp_logo.png';
import Pendencias from './Pendencias';
import ContextProvider, { useGeralContext } from './context/ContextProvider';

const SidebarWrapper = styled.div`
  position: fixed; /* Define a posição fixa */
  top: 0; /* Coloca a barra no topo da tela */
  left: 0; /* Coloca a barra no lado esquerdo da tela */
  height: 100%; /* Altura total da tela */
  width: 25%; /* Largura desejada da barra lateral */
  background-color: #2F3142;
  z-index: 1; /* Certifique-se de que a barra esteja acima de outros elementos */
`;


const Sidebar = ({ idSumario, onSelectConteudo, onSetIdExercicioSelecionado }) => {
  const { SolicitarSumario, SolicitarConteudoPorId, conteudoSelecionado, SolicitarExercicioPorID } = useGeralContext();
  const [listaSumario, setListaSumario] = useState()
  const [topicoAtual, setTopicoAtual] = useState(null)
  const history = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const listaSumarioResponse = await SolicitarSumario(idSumario);
        console.log(listaSumarioResponse)
        setListaSumario(listaSumarioResponse)
        setTopicoAtual(listaSumarioResponse.topics[0])
        await SolicitarConteudoPorId(listaSumarioResponse.topics[0].subtopics[0].contentId)
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);


  // Função para selecionar conteúdo de atividades
  const handleAtividadesClick = () => {
    // Lógica para carregar o conteúdo de atividades (substitua isso pelo que você precisa)
    onSelectConteudo("atividade");
  };

  // Função para selecionar conteúdo de tópico
  const handleTopicoClick = () => {
    // Lógica para carregar o conteúdo do tópico (substitua isso pelo que você precisa)

    onSelectConteudo("conteudo");
  };


  if (!listaSumario || !topicoAtual || !topicoAtual.subtopics) {

    return (
      <SidebarWrapper>
        <Skeleton h='20%' ml='5%' marginBottom='10px' />
        <Skeleton h='5%' ml='5%' marginBottom='10px' />
        <Skeleton h='70%' ml='5%' marginBottom='10px' />
      </SidebarWrapper>
    )

  } else {

    return (
      <SidebarWrapper>
        <Flex flex={1} m="10px" mr='20px' flexDir='column' alignItems='flex-start'>

          <Flex className='menu' flexDir='column'>
            <RiMenuFoldFill onClick={() => { history("/") }} style={{ width: "30px", height: "30px" }} />
            <Flex className='menuDetalhesCurso' flexDir='row' ml='40px' mt='20px' mb='10px' gap='10px' alignItems='flex-start'  >
              <Box>
                <Image src={imgTeste} w='40px' />
              </Box>
              <Box>
                <Text fontWeight='bold' alignSelf='flex-start'>{listaSumario.theme}</Text>
                <Box display='flex' flexDir='row' fontSize='10px'>
                  <Text>{listaSumario.category}</Text> - <Text>{listaSumario.subcategory}</Text>
                </Box>
              </Box>
            </Flex>
            <Box ml='40px'>
              <Progress colorScheme='whatsapp' w='300px' borderRadius='10px' size='sm' bg="#4E506F" value={20} />
            </Box>
          </Flex>

          <Flex className='conteudo' mt='20px' w='100%' flexDir='column'>
            <Flex className='cabecalhoConteudo' w='100%' mb='30px'>
              <Menu siz>
                <MenuButton color='white' size='xl' bg='#575A77' ml='30px' h='20px' w='100%' as={Button} display='flex' p='10px'>
                  <Box display='flex' flexDir='row' justifyContent='space-between' alignItems='center'>
                    <Text > {topicoAtual.index}-{topicoAtual.title}</Text>
                    <AiOutlineDown />
                  </Box>
                </MenuButton>
                      
                <MenuList border='none' MenuButton bg='#575A77' h='20px' w='325px' mb="5">
                  {listaSumario.topics.map((obj) => (
                    <MenuItem style={{
                      backgroundColor: '#575A77',
                      color: 'white',
                      width: '100%',
                      fontSize: '18px',
                      rowGap: "5",
                    }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#4E506F'; // Altera a cor de fundo ao passar o mouse
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#575A77'; // Restaura a cor de fundo ao retirar o mouse
                      }} fontSize='10px' h='25px' minW="100%" bg='#575A77'
                      onClick={() => { setTopicoAtual(obj) }}>
                      {obj.title}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>


            <Flex ml='30px' flexDir='column'>
              <Box display='flex' flexDir='row' gap='10px' alignItems='center'>
                <BsBookHalf color='#696D8F' />
                <Text color='#696D8F'>Tópicos</Text>
              </Box>
              <Flex flexDir='column'>

                {
                  topicoAtual && topicoAtual.subtopics && topicoAtual.subtopics.map((obj, index) => (
                    <Flex key={index} flexDir='column' mt='12px'>
                      <Divider />
                      <Box display='flex' alignItems='center' mt='12px' mb='12px' gap='10px' cursor='pointer' onClick={(e) => {
                        e.stopPropagation()

                        SolicitarConteudoPorId(obj.contentId)
                        handleTopicoClick()
                      }}>
                        <FaClipboardList color='#5762C0' />
                        <Text>{obj.index}-{obj.title}</Text>
                      </Box>
                      <Divider />
                      <Box display='flex' alignItems='center' mt='12px' cursor='pointer' gap='10px' onClick={(e) => {
                        e.stopPropagation()
                        onSetIdExercicioSelecionado(obj.exerciseId)
                        console.log(obj.exerciceId)
                        handleAtividadesClick()
                      }} >
                        <FaPencilAlt color='#5762C0' />
                        <Text>{obj.index}-Exercícios</Text>
                      </Box>
                    </Flex>
                  ))
                }

              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </SidebarWrapper>
    );
  }


};


function FormattedText({ text }) {
  // Divide o texto em linhas para processamento
  const lines = text.split('\n');

  // Variável para rastrear se estamos dentro de um bloco de código
  let inCodeBlock = false;

  // Função para formatar uma linha de acordo com os padrões
  const formatLine = (line, index) => {
    // Remover espaços em branco no início e no final da linha
    const linePadrao = line
    line = line.trim();

    if (line.startsWith('# ')) {
      // Título de nível 1
      const titleText = line.replace(/^# (.+?)$/, '$1');
      return <Text fontSize='50px' fontWeight='bold' key={index}>{titleText}</Text>;
    } else if (line.startsWith('## ')) {
      // Subtítulo de nível 2
      const subtitleText = line.replace(/^## (.+?)$/, '$1');
      return <h2 key={index} style={{ fontSize: '50px', marginBottom: '20px', marginTop: '20px', fontWeight:'bold' }}>{subtitleText}</h2>;
    } else if (line.startsWith('### ')) {
      // Subtítulo de nível 3
      const subtitleText = line.replace(/^### (.+?)$/, '$1');
      return <h3 key={index} style={{ fontSize: '48px', marginBottom: '18px', marginTop: '18px', fontWeight:'bold' }}>{subtitleText}</h3>;
    } else if (line.startsWith('#### ')) {
      // Subtítulo de nível 4 (Dicas)
      const subtitleText = line.replace(/^#### (.+?)$/, '$1');
      return <h4 key={index} style={{ fontSize: '46px', marginBottom: '16px', marginTop: '16px', fontWeight:'bold' }}>{subtitleText}</h4>;
    } else if (line.startsWith('```')) {
      // Início ou fim de bloco de código
      inCodeBlock = !inCodeBlock;
      return null; // Não renderizar esta linha
    } else if (inCodeBlock) {
      // Linha dentro de um bloco de código
      return (
        <pre style={{ background: '#2F3142', padding: '15px' }} key={index}>
          <code style={{ color: '#E9FFFD' }}>{linePadrao}</code>
        </pre>
      );
    }
    // Se não corresponder a nenhum padrão, retorne o texto original
    return <p style={{ marginBottom: '3px', color: '#EDEDED' }} key={index}>{line}</p>;
  };

  return (
    <div>
      {lines.map((line, index) => formatLine(line, index))}
    </div>
  );
}



const ConteudoNovo = () => {

  const { conteudoSelecionado, SolicitarAtualizaçãoConteudoId } = useGeralContext();
  const toast = useToast();
  console.log(conteudoSelecionado)
  const valor = conteudoSelecionado ? conteudoSelecionado.body.find((obj) => obj.disabledDate === "0001-01-01T00:00:00Z") : undefined;

  // Use um useEffect para rastrear mudanças em conteudoSelecionado e atualizar conteudoRenderizadoAtual
  useEffect(() => {
    if (conteudoSelecionado) {
      const novoValor = conteudoSelecionado.body.find((obj) => obj.disabledDate === "0001-01-01T00:00:00Z");
      setConteudoRenderizadoAtual(novoValor);
    }
  }, [conteudoSelecionado]);

  const [conteudoRenderizadoAtual, setConteudoRenderizadoAtual] = useState(valor);

  if (!conteudoSelecionado) {
    return (
      <Flex flex={3} h='100%' flexDir='column' p='10px'>
        <Skeleton mb='20px' h='10%' p='10px' />
        <Skeleton h='90%' p='10px' />

      </Flex>

    )
  } else {
    return (
      <Flex flex={3} h='100%' flexDir='column' bg='#474859' whiteSpace='normal'>
        <Flex bg='#262734' h='100px' alignItems='center' justifyContent='space-between'>
          <Text ml='35%' fontSize={"50px"}>{conteudoSelecionado.title}</Text>

          <HStack spacing={1} mr='5%' >
            <Tooltip label='Atualizar conteudo' fontSize='md'>
              <IconButton
                bg="none"
                _hover="none"
                color="white"
                size="lg"
                icon={<AiOutlineEdit />}
                onClick={async () => {
                  try {
                    console.log("Conteudo atualizado");
                    console.log(conteudoSelecionado.id);
                    toast({
                      title: "Atualização solicitada, aguarde...",
                      status: "info", // Você pode escolher o status apropriado (info, warning, etc.)
                      duration: 30000, // Tempo que o toast ficará visível (em milissegundos)
                      isClosable: true, // Permite fechar o toast manualmente
                    });
                    await SolicitarAtualizaçãoConteudoId(conteudoSelecionado.id);
                  } catch (error) {
                    console.error(error);

                    // Exibir um toast de erro
                    toast({
                      title: "Erro ao solicitar atualização",
                      description: "Ocorreu um erro ao tentar solicitar a atualização.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
              />
            </Tooltip>

            <Menu>
              <Tooltip label='Histórico' fontSize='md'>
                <MenuButton

                  bg='none'
                  _hover='none'
                  as={IconButton}
                  aria-label='Options'
                  icon={<BiHistory color='white' />}
                />
              </Tooltip>
              <MenuList bg="#2F3142" p='10px'>
                {conteudoSelecionado.body.map((obj, index) => (
                  <MenuItem key={index} bg='#2F3142' _hover={{ bg: "#075E81" }} _active={{ bg: "#054B60" }} onClick={() => {
                    setConteudoRenderizadoAtual(obj)
                  }}>
                    <Flex flexDir='row' alignItems='center' gap='10px'>
                      <Text minW='70%' maxH='70%'>{obj.content.slice(0, 25)}...</Text>
                      {obj.disabledDate === '0001-01-01T00:00:00Z' ? <ViewIcon /> : null}
                    </Flex>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        <Flex flexDir='column' m='5%' h='100%' alignItems='center'>
          {conteudoRenderizadoAtual ? FormattedText({ text: conteudoRenderizadoAtual.content }) : <div>Ainda não posui conteudo</div>}
        </Flex>
      </Flex>
    )
  }
}


const App = (props) => {

  const { id } = useParams();
  const [conteudoSelecionado, setConteudoSelecionado] = useState('conteudo');
  const [idExercicioSelecionado, setIdExercicioSelecionado] = useState()
  return (
    <ContextProvider>
      <Flex flexDir="row" flex={1} width="100%" alignItems="stretch">
        <Box minW="25%">
          <Sidebar idSumario={id} onSelectConteudo={setConteudoSelecionado} onSetIdExercicioSelecionado={setIdExercicioSelecionado} />
        </Box>
        <Box flex={3} maxW='100%'>
          {
            conteudoSelecionado === "conteudo" ? <ConteudoNovo /> : <Pendencias idExercicio={idExercicioSelecionado} />
          }
        </Box>
      </Flex>
    </ContextProvider>
  );
};

export default App;

