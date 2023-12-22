import { name } from '@/atom';
import { insertDBAPI } from '@/lib/api/db';
import { Box, Button, HStack, VStack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const BoxArr = Array.from({ length: 3 }, () =>
  Array.from({ length: 3 }, () => ({
    bgColor: 'gray.300',
    isRed: false,
  })),
);

function findRedBoxPosition(boxes) {
  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      if (boxes[i][j].isRed) {
        return { row: i, col: j };
      }
    }
  }
  return { row: -1, col: -1 };
}

function Board() {
  const [count, setCount] = useState(0);
  const [boxes, setBoxes] = useState(BoxArr);
  const [accerData, setAccerData] = useState(null);
  const [gyroData, setGyroData] = useState(null);
  const [buttonOrder, setButtonOrder] = useState([]);
  const [iteration, setIteration] = useState(0);
  const uname = useRecoilValue(name);

  const maxIter = 50;

  const handleDeviceMotion = (event) => {
    const { alpha, beta, gamma } = event.rotationRate;
    const { x, y, z } = event.accelerationIncludingGravity;
    setGyroData({ alpha, beta, gamma });
    setAccerData({ x, y, z });
  };

  const shuffleArray = (arr) => {
    const shuffledArray = [...arr];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  useEffect(() => {
    let intervalId;
    async function getData() {
      intervalId = setInterval(async () => {
        const newBoxes = [...boxes];
        const nextRedBoxIndex = buttonOrder.pop();

        // 9개 버튼 중 클릭안한 버튼이 있는 경우
        if (nextRedBoxIndex !== undefined) {
          newBoxes[Math.floor(nextRedBoxIndex / 3)][nextRedBoxIndex % 3].isRed =
            true;
          newBoxes[Math.floor(nextRedBoxIndex / 3)][
            nextRedBoxIndex % 3
          ].bgColor = 'red.400';

          setBoxes(newBoxes);

          setTimeout(() => {
            newBoxes[Math.floor(nextRedBoxIndex / 3)][
              nextRedBoxIndex % 3
            ].bgColor = 'gray.300';
            newBoxes[Math.floor(nextRedBoxIndex / 3)][
              nextRedBoxIndex % 3
            ].isRed = false;
            setBoxes(newBoxes);
          }, 1300);
        } else {
          if (iteration <= maxIter - 1) {
            setIteration((prev) => prev + 1);
            const allBoxIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            const shuffle = shuffleArray(allBoxIndices);
            setButtonOrder(shuffle);
          } else {
            clearInterval(intervalId);
          }
        }
      }, 1300);
    }
    getData();
    return () => clearInterval(intervalId);
  }, [boxes, buttonOrder, iteration, maxIter]);

  useEffect(() => {
    window.addEventListener('devicemotion', handleDeviceMotion);
    const allBoxIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const shuffle = shuffleArray(allBoxIndices);
    setButtonOrder(shuffle);
  }, []);

  const onSavePerClick = async (e) => {
    e.persist();
    setCount((prev) => prev + 1);
    const { row, col } = findRedBoxPosition(boxes);
    const dataToStore = {
      name: uname,
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      acc_x: accerData.x,
      acc_y: accerData.y,
      acc_z: accerData.z,
      gyro_x: gyroData.alpha,
      gyro_y: gyroData.beta,
      gyro_z: gyroData.gamma,
      row,
      col,
    };
    const res = await insertDBAPI('touchdata', dataToStore);
    console.log('res', res);
  };

  return (
    <Box>
      <HStack h="60px" bgColor="red.400" justifyContent="center">
        <Text fontSize="3xl">데이터 수집 페이지</Text>
      </HStack>
      <HStack justifyContent="center" mt="14px" h="40px">
        <Text fontSize="3xl">
          시도: {iteration}, 터치횟수: {count}
        </Text>
      </HStack>
      <VStack mt="24px" spacing="40px" onClick={onSavePerClick}>
        {boxes.map((hitem, idx) => (
          <HStack key={`row-${idx}`} spacing="32px">
            {hitem.map((box, jdx) => (
              <Button
                mt={idx !== 0 ? '62px' : 0}
                bgColor={box.bgColor}
                key={`${idx}-${jdx}`}
                w="80px"
                h="90px"
              />
            ))}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

export default Board;
