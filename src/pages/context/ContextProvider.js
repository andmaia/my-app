import React, { useState, useContext, createContext, useEffect } from 'react';
import {axios} from 'axios';
const ContextGeral = createContext();

function ContextProvider({ children }) {

    const ObjTesteExercicio = {
        "theme": "Python",
        "exercise": {
            "id": "6bf3b085-a349-4738-b90c-289d55468fcf",
            "ownerId": "iacademy",
            "contentId": "dd93d003-990b-40d9-aa48-01bb7609006c",
            "configurationId": "f7affa21-fad1-4903-a4c5-12615531ab03",
            "status": 0,
            "type": 0,
            "sendedAt": "0001-01-01T00:00:00Z",
            "topicIndex": "1.4",
            "title": "Operadores e Expressões",
            "exercises": [
                {
                    "identification": 1,
                    "type": 2,
                    "question": "Escreva um código em Python que use todos os operadores aritméticos para resolver a seguinte expressão matemática: (6 + 4) / 2 * 3 - 1. O resultado deve ser atribuído a uma variável chamada 'resultado'.",
                    "complementation": []
                },
                {
                    "identification": 2,
                    "type": 1,
                    "question": "Qual é a função do operador de identidade 'is' em Python?",
                    "complementation": [
                        "a - Retorna True se as duas variáveis são o mesmo objeto",
                        "b - Retorna True se as duas variáveis não são o mesmo objeto",
                        "c - Retorna True se as duas variáveis têm o mesmo valor",
                        "d - Retorna True se as duas variáveis não têm o mesmo valor",
                        "e - Retorna True se as duas variáveis têm o mesmo tipo"
                    ]
                },
                {
                    "identification": 3,
                    "type": 0,
                    "question": "Identifique as afirmações verdadeiras sobre os operadores em Python",
                    "complementation": [
                        "a - Os operadores de atribuição são usados para atribuir valores a variáveis",
                        "b - Operadores bit a bit só podem ser aplicados a números",
                        "c - Operadores de comparação são usados para comparar dois valores",
                        "d - Operadores de adesão são usados para testar se uma sequência é apresentada em um objeto",
                        "e - Operadores lógicos são usados para combinar condicionais"
                    ]
                }
            ]
        }

    }

    const ObjTexteFeedback = {
        "id": "a7badebe-9934-456d-8b39-8ddb61f6a632",
        "exerciseId": "08689b11-54de-4247-a949-08a30b4e5246",
        "ownerId": "iacademy",
        "createdDate": "2023-09-09T15:49:45.6052627Z",
        "updatedDate": "2023-09-09T15:49:45.605263Z",
        "corrections": [
            {
                "identification": 1,
                "question": "Qual comando é usado para atualizar o índice de pacotes do apt?",
                "complementation": [],
                "isCorrect": true,
                "feedback": "O comando sudo apt-get update é usado para atualizar a lista de pacotes disponíveis para instalação ou atualização."
            },
            {
                "identification": 2,
                "question": "Verdadeiro ou falso: O comando 'sudo apt-get install docker-ce docker-ce-cli containerd.io' é usado para instalar a última versão do Docker CE.",
                "complementation": [],
                "isCorrect": true,
                "feedback": "Sim, o comando 'sudo apt-get install docker-ce docker-ce-cli containerd.io' é usado para instalar a última versão do Docker CE."
            },
            {
                "identification": 3,
                "question": "Escreva o comando usado para verificar se o Docker foi instalado corretamente, executando o programa de exemplo do Docker.",
                "complementation": [],
                "isCorrect": true,
                "feedback": "O comando 'sudo docker run hello-world' é usado para verificar se o Docker foi instalado corretamente, executando o programa de exemplo do Docker."
            }
        ]
    }


    const [listaExerciciosPendentes, setListaExerciciosPendentes] = useState([ObjTesteExercicio])
    const [listaDeCursos, setListaDeCursos] = useState(); // Defina os dados iniciais aqui
    const [listaConteudoPorSumario, setListaConteudoPorSumario] = useState();
    const [exercicioConteudoSelecionado, setExercicioConteudoSelecionado] = useState();
    const [feedbackAtual, setFeedbackAtual] = useState(ObjTexteFeedback)
    const [conteudoSelecionado,setConteudoSelecionado] =useState()

    async function SolicitarSumario(id) {
        try {
            const response = await axios.get(
                "https://iacademy-api.azurewebsites.net/api/summary/" + id
            );
            if (response && response.data) {
                const dados = response.data;
                return dados;

            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    function atualizaListaExerciciosPendentes(exercise, theme) {
        const novoObj = { "theme": theme, "exercise": exercise }
        const novaListaExerciciosPendentes = [...listaExerciciosPendentes, novoObj]
        setListaExerciciosPendentes(novaListaExerciciosPendentes)
    }

    async function SolicitarConteudosPorSumario(id) {
        try {
            const response = await axios.get(
                "https://iacademy-api.azurewebsites.net/api/content/summary/" + id
            );
            if (response && response.data) {
                const dados = response.data;
                return dados;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Erro ao solicitar conteudos do sumário:", error);
            throw error;
        }
    }

    function exercicioSelecionadoParaMenu(exercicio) {
        const exercicioJSON = JSON.stringify(exercicio);
        sessionStorage.setItem('exercicioSelecionado', exercicioJSON);
    }


    async function SolicitarConteudoPorId(contentID) {
        try {
            const apiUrl = `https://iacademy-api.azurewebsites.net/api/content/${contentID}`;
            const response = await axios.get(apiUrl);
            if (response.status === 200) {
                setConteudoSelecionado(response.data)
            } else {
                throw new Error(`Erro ao buscar dados para o contentID ${contentID}`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function SolicitarExercicioPorID(exerciseID) {
        console.log("Chave do ex é: " + exerciseID)
        try {
            const apiUrl = `https://iacademy-api.azurewebsites.net/api/exercise/${exerciseID}`;
            const response = await axios.get(apiUrl);
            if (response.status === 200) {
                const exercicio = response.data
                setExercicioConteudoSelecionado(exercicio)
            } else {
                throw new Error(`Erro ao buscar dados para o exerciseID ${exerciseID}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

 
    async function CriarCorrecaoPorExerciseId(exerciseID, seuObjetoDeDados) {
        try {

            const apiUrl = "https://iacademy-api.azurewebsites.net/api/ai/exercise/" + exerciseID + "/request-correction";

            const response = await axios.post(apiUrl, seuObjetoDeDados, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
            });

            if (response.status === 201) {
                const feedback = response.data;
                return feedback;
            } else {
                throw new Error(`Erro ao retornar o feedback ${exerciseID}`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    
    async function SolicitarAtualizaçãoConteudoId(conteudoId) {
        try {

            const apiUrl ="https://iacademy-api.azurewebsites.net/api/ai/content/"+conteudoId+"/new-content";

            const response = await axios.post(apiUrl);
            console.log(response)
            if (response.status === 201) {
                        console.log('conteudo atualizado')
                        SolicitarConteudoPorId(response.data)
            } else {
                console.log(`Erro ao obter novo conteudo criado`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    

    async function CorrecaoPorCorrectionId(correctionID) {
        try {
            const apiUrl = `https://iacademy-api.azurewebsites.net/api/correction/`+ correctionID;
            const response = await axios.get(apiUrl);
            if (response.status === 200) {
                const feedback = response.data
                return feedback
            } else {
                throw new Error(`Erro ao retornar o feedback ${correctionID}`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return (
        <ContextGeral.Provider
            value={{
                listaExerciciosPendentes,
                atualizaListaExerciciosPendentes,
                listaDeCursos,
                SolicitarConteudoPorId,
                SolicitarExercicioPorID,
                SolicitarSumario,
                listaConteudoPorSumario,
                SolicitarConteudosPorSumario,
                setExercicioConteudoSelecionado,
                exercicioConteudoSelecionado,
                exercicioSelecionadoParaMenu,
                CorrecaoPorCorrectionId,
                CriarCorrecaoPorExerciseId,
                SolicitarAtualizaçãoConteudoId,
                feedbackAtual,
                conteudoSelecionado
            }}
        >
            {children}
        </ContextGeral.Provider>
    );
}

export default ContextProvider;

export const useGeralContext = () => {
    const context = useContext(ContextGeral);
    if (!context) {
        throw new Error('useGeralContext deve ser usado dentro de um ContextProvider');
    }
    return context;
};




