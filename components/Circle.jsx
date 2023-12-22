import { Box } from '@chakra-ui/react';
import React from 'react';

const colorList = [
  'gray.500',
  'red.500',
  'orange.500',
  'yellow.500',
  'green.500',
  'teal.500',
  'blue.500',
  'purple.500',
  'pink.600',
];

function Circle({ ...props }) {
  return (
    <Box
      position="absolute"
      w="5px"
      h="5px"
      bgColor={colorList[props.row * 3 + props.col]}
      borderRadius="50%"
      zIndex={20}
      top={props.top}
      left={props.left}
    />
  );
}

export default Circle;
