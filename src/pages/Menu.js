import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Link as ChakraLink,
  Divider,
  Flex,
  Icon,
  IconButton,
  useMediaQuery
} from '@chakra-ui/react';
import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import { Link as RouterLink } from 'react-router-dom';

export default function App() {  
  const [isSmOrMd] = useMediaQuery("(max-width: 124rem)");
  return (
    <Flex
    pos="fixed"
    h={isSmOrMd ? '90px' : '100vh'}
    w={isSmOrMd ? '100vw' : '75px'}
    flexDirection={isSmOrMd ? 'column' : 'row'}
    bg="#262734"
    left="0"
    right={isSmOrMd ? 'none' : '0'}
    zIndex="999"
    bottom="0"
    overflow={isSmOrMd ? 'auto' : 'hidden'}
    justifyContent="space-around"
    
  >
    <Flex
      flexDirection={isSmOrMd ? 'row' : 'column'}
      alignItems={isSmOrMd ? 'center' : 'flex-start'}
      as="nav"
      mt={isSmOrMd ? '0' : '10'}
      ml={isSmOrMd ? '5' : '0'}
      justifyContent="flex-start"
      gap={"3rem"}
      
    >
      <IconButton
        background="none"
        _hover={{ background: 'none' }}
        icon={<HamburgerIcon w={8} h={8} color="white" mt={5} mb={5} />}
      />
      <Divider 
        w={isSmOrMd ? '15' : '100%'}
      />
      <ChakraLink
        as={RouterLink}
        to="/"
        p={3}
        borderRadius={8}
        _hover={{ textDecor: 'none', backgroundColor: '#AEC8CA' }}
        w="100%"
      >
        <Flex alignItems="center">
          <Icon as={AiFillHome} fontSize="xl" color="#0880A2" h={7} w={7} />
        </Flex>
      </ChakraLink>
      <Divider 
        w={isSmOrMd ? '15' : '100%'}
      />
      <ChakraLink
        as={RouterLink}
        to="/perfil"
        p={3}
        borderRadius={8}
        _hover={{ textDecor: 'none', backgroundColor: '#AEC8CA' }}
        w="100%"
      >
        <Flex alignItems="center">
          <Icon as={BsFillPersonFill} fontSize="xl" color="#0880A2" h={7} w={7} />
        </Flex>
      </ChakraLink>
    </Flex>
  </Flex>
);
}