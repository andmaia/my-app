import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Radio,
    RadioGroup,
    Skeleton,
    Spinner,
    Text,
    Textarea,
    VStack,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useDisclosure
} from '@chakra-ui/react';
import { format, set } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Menu from '../pages/Menu';
import ContextProvider, { useGeralContext } from './context/ContextProvider';
import { useToast } from '@chakra-ui/react';
var respostas = {
    "exercises": [
    ]
}

function mandarParaListaDeRespostas(id, resposta) {
    const novaRespostaExercicio = {
        identification: id,
        answer: resposta
    }

    respostas.exercises.push(novaRespostaExercicio);
}


const estilos = {
    divzinha: {
        backgroundColor: '#262734',
        width: '100%',
        borderRadius: '3px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'row',
        height: '10%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    texto: {
        color: 'white',
        fontWeight: 'bold',
        flexWrap: 'wrap',
        maxWidth: '89%',
        fontFamily: '',
        fontSize: '12px',
    },
    conteudo: {
        backgroundColor: '#2F3142',
        width: '100%',
        padding: '20px',
        height: '100%',

    },
    textoConteudo: {
        fontSize: '10px',
    },
    cabecalhoSumario: {
        backgroundColor: '#262734',
        width: '60%',
        padding: '10px',
        borderRadius: '3px',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'column',
    },
    cabecalhoSumario1: {
        backgroundColor: '#262734',
        width: '100%',
        padding: '10px',
        borderRadius: '3px',
        display: 'flex',
        flexDirection: 'row',
    },
    sumario: {
        backgroundColor: '#2F3142',
        width: '60%',
        padding: '20px',
        height: '34rem',
    },
};


const exercicioTeste = {
    "id": "afad4533-a967-4b39-997f-2e3baf4a79a3",
    "ownerId": "39bd86c2-d32d-41ad-941e-7ab8fa891de5",
    "contentId": "ab5d6f19-faf0-4ec0-83fe-63bfc16f14e6",
    "configurationId": "078df11e-b8ec-420e-8924-d46e1c2c1c32",
    "status": "WaitingToDo",
    "type": "Default",
    "sendedAt": "0001-01-01T00:00:00Z",
    "topicIndex": "1.1",
    "title": "História e características do C#",
    "exercises": [
        {
            "identification": 1,
            "type": "Code",
            "question": "Escreva um código em C# que declare uma variável do tipo inteiro, atribua um valor a ela e, em seguida, imprima esse valor na saída padrão.",
            "complementation": []
        },
        {
            "identification": 2,
            "type": "SingleChoice",
            "question": "Qual das seguintes afirmações é verdadeira sobre a linguagem de programação C#?",
            "complementation": [
                "a - C# não é uma linguagem orientada a objetos.",
                "b - C# foi desenvolvida pela Apple.",
                "c - C# não permite o desenvolvimento de aplicações seguras e robustas.",
                "d - C# foi desenvolvida pela Microsoft como parte de sua plataforma .NET.",
                "e - C# não é compatível com o .NET Framework."
            ]
        },
        {
            "identification": 3,
            "type": "MultipleChoice",
            "question": "Marque as opções que são características da linguagem de programação C#.",
            "complementation": [
                "a - C# é orientada a objetos.",
                "b - C# combina os melhores recursos de linguagens como C++ e Java.",
                "c - C# não permite a criação de aplicações seguras e robustas.",
                "d - C# é uma linguagem de programação moderna desenvolvida pela Microsoft como parte de sua plataforma .NET.",
                "e - C# não é compatível com o .NET Framework."
            ]
        }
    ]
}


const ExercicioDescritivo = ({ question, identification, exercicioEntregado }) => {

    const [valor, setValor] = useState("")

    if (exercicioEntregado) {
        mandarParaListaDeRespostas(identification, valor)
    }
    console.log(exercicioEntregado)

    return (
        <Box style={estilos.conteudo}>
            <Text fontSize="sm" fontWeight="semibold" mb={'1rem'}>
                {identification} - {question}
            </Text>
            <Flex w={'100%'} direction="column" rowGap={'1rem'}>
                <Textarea placeholder='Escreva sua resposta'
                    size='sm' value={valor}
                    onChange={(event) => setValor(event.target.value)} />
            </Flex>

        </Box>
    )

}

const ExercicioUmaRespostas = ({ question, complementation, identification, exercicioEntregado }) => {
    const [alternativaSelecionada, setAlternativaSelecionada] = useState("");


    if (exercicioEntregado && alternativaSelecionada) {
        mandarParaListaDeRespostas(identification, alternativaSelecionada);
    }

    return (
        <Box style={estilos.conteudo}>
            <Text fontSize="sm" fontWeight="semibold" mb={'1rem'}>
                {identification} - {question}
            </Text>
            <RadioGroup>
                <Flex alignItems='flex-start' direction="column" rowGap={'1rem'} mb={'2rem'}>
                    <RadioGroup onChange={setAlternativaSelecionada} value={alternativaSelecionada} alignItems='flex-start'>
                        <VStack direction='row' alignItems='flex-start'>
                            {complementation.map((option, key) => (
                                <Radio value={option}>{option}</Radio>
                            ))}
                        </VStack>
                    </RadioGroup>
                </Flex>
            </RadioGroup>
        </Box>
    )
}

const ExercicioMultiplasRespostas = ({ question, complementation, identification, exercicioEntregado }) => {
    const [respostasSelecionadas, setRespostasSelecionadas] = useState("");

    const handleCheckboxChange = (value) => {
        if (respostasSelecionadas.includes(value)) {
            // Remove a resposta da string
            const novaString = respostasSelecionadas.replace(value + "-", "");
            setRespostasSelecionadas(novaString);
        } else {
            // Adiciona a resposta à string
            setRespostasSelecionadas(respostasSelecionadas + value + "-");
        }
    };

    if (exercicioEntregado && respostasSelecionadas.length > 0) {
        // Aqui você pode usar a string respostasSelecionadas diretamente como desejar
        mandarParaListaDeRespostas(identification, respostasSelecionadas);
    }

    return (
        <Box style={estilos.conteudo}>
            <Text fontSize="sm" fontWeight="semibold" mb="1rem">
                {identification} - {question}
            </Text>
            <VStack alignItems="flex-start" spacing="1rem">
                {complementation.map((option, key) => (
                    <Checkbox
                        key={key}
                        isChecked={respostasSelecionadas.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        variant='circular'

                    >
                        {option}
                    </Checkbox>
                ))}
            </VStack>
        </Box>
    );
};


const Questionario = ({ idExercicio }) => {

    const { SolicitarExercicioPorID, exercicioSelecionadoParaMenu, CorrecaoPorCorrectionId, CriarCorrecaoPorExerciseId, exercicioConteudoSelecionado } = useGeralContext(ContextProvider);
    const cancelRef = React.useRef()
    const toast = useToast();

    const [exercicioEntregado, setExercicioEntregado] = useState(false)
    const [confirmado, setConfirmado] = useState(false)

    function retoranrExercicioEntregado() {
        return respostas
    }
    const { isOpen, onOpen, onClose } = useDisclosure()

    const history = useNavigate();

    const RedirecionarParaTelaFeedback = (id) => {
        history('/feedback/' + id);
    };



    exercicioSelecionadoParaMenu(idExercicio)

    useEffect(() => {
        SolicitarExercicioPorID(idExercicio)
    }
        , [])




    if (!exercicioConteudoSelecionado || exercicioConteudoSelecionado === undefined) {
        return (<Skeleton h="50vh" />)
    }

    return (
        <Flex
            alignItems={'center'}
            flexDirection={'column'}
            style={{ width: '100%' }}
        >
            <Flex style={estilos.divzinha}>
                {exercicioConteudoSelecionado.status === "Finished" ? <CheckCircleIcon h="30px" w="30px" color="green" /> : <WarningIcon color='yellow' />}

                <Box flex={1} padding="20px">
                    <Text mt={1} fontSize="sm">
                        {exercicioConteudoSelecionado.title}
                    </Text>
                </Box>

                <Flex gap="10px" flexDir='row' alignItems='center'>
                    <Button isDisabled={exercicioConteudoSelecionado.status === "Finished" ? false : true} colorScheme="blue" m={'0.5rem'} alignSelf={'flex-end'} size='xs' onClick={
                        async () => {
                            const feedback = await CorrecaoPorCorrectionId(exercicioConteudoSelecionado.correctionId);
                            RedirecionarParaTelaFeedback(feedback.id)
                        }
                    }>
                        {exercicioConteudoSelecionado.status === "Finished" ? "Ver feedback" : "Feedback não disponível"}
                    </Button>

                    <Button
                        size='xs'
                        isDisabled={exercicioConteudoSelecionado.status === "Finished" || confirmado  ? true : false}
                        colorScheme={exercicioConteudoSelecionado.status  === "Finished"  || confirmado? "green" : "blue"} onClick={async () => {
                            onOpen()
                            setExercicioEntregado(true)
                            console.log(exercicioEntregado)

                        }}>
                        {exercicioConteudoSelecionado.status === "Finished" || confirmado ? "Entregado" : "Entregar"}
                    </Button>

                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent bg='#2F3142' color='white'>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    Entregar exercícios
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Tem certeza que deseja entregar o exercício?
                                </AlertDialogBody>

                                <AlertDialogFooter >
                                    <Button color='white' ref={cancelRef} bg='#0880A2' onClick={() => {
                                        setExercicioEntregado(false)
                                        console.log(exercicioEntregado)
                                        onClose()
                                    }}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        color='white'
                                        bg='#0880A2'
                                        onClick={async () => {
                                            try {
                                                setExercicioEntregado(false);
                                                console.log("Mandou esse obj de respostas:", respostas);
                                                setConfirmado(true)
                                                onClose();
                                                toast({
                                                    title: 'Solicitado correção do exercício. Aguarde',
                                                    status: 'success',
                                                    duration: 30000, // Tempo que o toast ficará visível (em milissegundos)
                                                    isClosable: true, // Permite fechar o toast manualmente
                                                });
                                                const feedback = await CriarCorrecaoPorExerciseId(idExercicio, JSON.stringify(respostas));
                                                RedirecionarParaTelaFeedback(feedback.id);

                                            } catch (error) {
                                                console.error(error);

                                                // Exibir um toast de erro
                                                toast({
                                                    title: 'Erro ao entregar',
                                                    description: 'Ocorreu um erro ao tentar entregar.',
                                                    status: 'error',
                                                    duration: 3000,
                                                    isClosable: true,
                                                });
                                            }
                                        }}
                                        ml={3}
                                    >
                                        Entregar
                                    </Button>

                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>

                </Flex>
            </Flex>
            <VStack alignItems="center" w="100%" bg='#474859' padding='1%' h='100%'>
                {exercicioConteudoSelecionado.exercises != null && exercicioConteudoSelecionado.exercises[0].identification !== 0 ? (
                    exercicioConteudoSelecionado.exercises.map((item, key) => {
                        switch (item.type) {
                            case "Code":
                                return <ExercicioDescritivo key={key} exercicioEntregado={exercicioEntregado} question={item.question} identification={item.identification}
                                />;
                            case "SingleChoice":
                                return (
                                    <ExercicioUmaRespostas
                                        exercicioEntregado={exercicioEntregado}
                                        key={key}
                                        question={item.question}
                                        complementation={item.complementation}
                                        identification={item.identification}
                                    />
                                );
                            case "MultipleChoice":
                                return (
                                    <ExercicioMultiplasRespostas
                                        exercicioEntregado={exercicioEntregado}
                                        key={key}
                                        question={item.question}
                                        complementation={item.complementation}
                                        identification={item.identification}
                                    />
                                );
                            default:
                                return <Text>Sem questão</Text>;
                        }
                    })
                ) : (<Box>Não há questões para esse topico. </Box>)}
            </VStack>
        </Flex>
    );
}

function App({ idExercicio }) {

    return (
        <ContextProvider>
            <Flex direction={'row'} flex={3} padding='2px' style={{ width: '100%', height: "100%", overflow: "auto" }}>
                <Questionario idExercicio={idExercicio} />
            </Flex>
        </ContextProvider>

    );

};

export default App;
