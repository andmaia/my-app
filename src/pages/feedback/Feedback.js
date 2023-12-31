import { CloseIcon } from '@chakra-ui/icons';
import {
  Flex,
  Skeleton,
  Text
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContextProvider, { useGeralContext } from '../context/ContextProvider';
import ExercicioDescritivo from './ExercicioDescritivo';
import ExercicioUmaRespostas from './ExercicioUmaResposta';

const Feedback = ({idFeedback}) => {
  const {CorrecaoPorCorrectionId} = useGeralContext(ContextProvider);
  const [feedback, setFeedback] = useState();
  const history = useNavigate();
  
  const Redirecionar = () => {
    history(-1)
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackRetornado = await CorrecaoPorCorrectionId(idFeedback);
        setFeedback(feedbackRetornado);
      } catch (error) {
        console.error("Erro ao buscar feedback:", error);
      }
    };
  
    fetchData(); 
  }, []);


  if(!feedback){
    return(
        <Skeleton h='30vh'/>
    )
  }

  return (
    <Flex
      alignItems={'center'}
      flexDirection={'column'}
      style={{ width: '100%' }}
    >
      <CloseIcon alignSelf={'end'} mt={"2.5rem"} mr={"10rem"} width={"20px"}  backgroundColor={"2F3142"}  onClick={()=>{
        Redirecionar()
      }}/>
      <Text textAlign="center" fontSize="4xl" fontWeight="bold" mt={0} mb={5}>
        Feedback
      </Text>

      <Flex w="85%" flexDir='column'>
        <Flex h="3rem" bg="#262734" flexDir="row" w="100%" alignItems="center" justifyContent='flex-start'>
          <Text ml="20px">Correção:</Text>
        </Flex>
        <Flex flexDir="column" padding="20px" bg="#2F3142">
            {feedback.corrections.map((correcao) => {
             if(correcao.complementation.length>0){
              return <ExercicioUmaRespostas exercicio={correcao} />
             }else{
              return <ExercicioDescritivo exercicio={correcao}/>
             }    
            })}
        </Flex>
      </Flex>
    </Flex>
  );
};

const App = () => {
  const {id} =useParams()

  return (
    <ContextProvider>
      <Flex direction={'row'} style={{ width: '100%' }}>
        <Feedback idFeedback={id}/>
      </Flex>
    </ContextProvider>
  );
};

export default App;
