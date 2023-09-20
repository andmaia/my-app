import {
    Box,
    Radio,
    RadioGroup,
    Text,
    VStack
} from '@chakra-ui/react';
import React from 'react';


const ExercicioUmaRespostas = ({ exercicio }) => {
    const getCorrectOption = () => {
      const answer = exercicio.answer ? exercicio.answer.charAt(0).toLowerCase() : ''; 
      const optionsMap = {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        'e': 4,
      };
  
      return optionsMap[answer] !== undefined ? optionsMap[answer] : -1; 
    };
  
    const correctOption = getCorrectOption();
  
    return (
      <Box backgroundColor='#2F3142' width='100%' padding='20px' height='100%'>
        <Text fontSize="sm" fontWeight="semibold" mb={'1rem'}>
          {exercicio.identification} - {exercicio.question}
        </Text>
        <RadioGroup mb='10px' value={correctOption} border="0.5px solid" isReadOnly borderColor={exercicio.isCorrect ? "green" : "red"} borderRadius="5px" bg="#262734" p="10px" width="100%" color="grey" padding='10px'>
          <VStack direction='row' alignItems='flex-start'>
            {exercicio.complementation.map((option, index) => (
              <Radio colorScheme={exercicio.isCorrect ? 'green' : 'red'} variant='' key={index} value={index}>
                {option}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>
        <Text fontSize="10px" fontWeight='bold'>Resposta: {exercicio.feedback}</Text>
      </Box>
    );
  };


export default ExercicioUmaRespostas;