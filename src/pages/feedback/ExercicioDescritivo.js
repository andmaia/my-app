import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import {
    Flex,
    Text
} from '@chakra-ui/react';
import React from 'react';

const ExercicioDescritivo =({exercicio})=>{
    return(
      <Flex flexDir="column" borderRadius="3px" gap="10px" justify="flex-start" padding="20px">
        <Text fontSize="15px">{exercicio.identification} - {exercicio.question}</Text>
        <Flex mb='10px' flexDirection="row" justifyContent='space-between' alignItems='center' border="0.5px solid" borderColor={exercicio.isCorrect ? "green" : "red"} borderRadius="5px" bg="#262734" p="10px" width="100%" color="grey">
          <Text>{exercicio.answer}</Text>
          {exercicio.isCorrect ? <CheckCircleIcon color="green" /> : <WarningIcon color="red" />}
        </Flex>
        <Text fontSize="10px" fontWeight='bold'  >Resposta: {exercicio.feedback}</Text>
      </Flex>
    )
  }

 export default ExercicioDescritivo