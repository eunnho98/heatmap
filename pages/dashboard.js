import { name } from '@/atom';
import Circle from '@/components/Circle';
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

const BoxArr = Array.from({ length: 3 }, () =>
  Array.from({ length: 3 }, () => ({
    bgColor: 'gray.300',
    isRed: false,
  })),
);

const colorList = [
  'gray.200',
  'red.200',
  'orange.200',
  'yellow.200',
  'green.200',
  'teal.200',
  'blue.200',
  'purple.200',
  'pink.300',
];

function DashBoard() {
  const accerDataRef = useRef(null);
  const [skt, setSkt] = useState(null);
  const [xinter, setXinter] = useState(0);
  const [yinter, setYinter] = useState(0);
  const [zinter, setZinter] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [boxes, setBoxes] = useState(BoxArr);
  const [res, setRes] = useState();
  const [dots, setDots] = useState();
  const [percent, setPercent] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const uname = useRecoilValue(name);

  const handleDeviceMotion = (event) => {
    const { x, y, z } = event.accelerationIncludingGravity;
    accerDataRef.current = { x, y, z };
  };

  // 최초 렌더링시 소켓연결
  useEffect(() => {
    window.addEventListener('devicemotion', handleDeviceMotion);
    const serverURL = 'wss://163.180.186.123:8000/ws/' + uname;
    const ws = new WebSocket(serverURL);
    setSkt(ws);
  }, []);

  useEffect(() => {
    if (skt === null || skt === undefined) {
      console.log('skt is null');
    } else {
      const interval = setInterval(() => {
        const acc_x = accerDataRef.current.x;
        const acc_y = accerDataRef.current.y;
        const acc_z = accerDataRef.current.z;

        const data = JSON.stringify({
          x_rad: Math.acos(
            acc_x /
              Math.sqrt(
                Math.pow(acc_x, 2) + Math.pow(acc_y, 2) + Math.pow(acc_z, 2),
              ),
          ),
          y_rad: Math.acos(
            acc_y /
              Math.sqrt(
                Math.pow(acc_x, 2) + Math.pow(acc_y, 2) + Math.pow(acc_z, 2),
              ),
          ),
          z_rad: Math.acos(
            acc_z /
              Math.sqrt(
                Math.pow(acc_x, 2) + Math.pow(acc_y, 2) + Math.pow(acc_z, 2),
              ),
          ),
        });

        skt.send(data);
        skt.onmessage = (e) => {
          const message = JSON.parse(e.data);
          setRes(message);
        };
      }, 200);
      setIntervalId(interval);
    }
  }, [skt]);

  const submitInterval = () => {
    if (skt === null || skt === undefined) {
      const serverURL = 'wss://163.180.186.123:8000/ws/' + uname;
      const ws = new WebSocket(serverURL);
      setSkt(ws);
    }
    const data = JSON.stringify({
      xinter,
      yinter,
      zinter,
    });
    skt.send(data);
  };

  useEffect(() => {
    if (res !== undefined) {
      if (Object.keys(res).length === 1) {
        setDots(-1);
        setPercent([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      } else {
        const newArr = Object.keys(res.col).map((key) => ({
          x: res.x[key],
          y: res.y[key],
          row: res.row[key],
          col: res.col[key],
        }));
        const percentArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        newArr.forEach((item) => {
          const idx = item.row * 3 + item.col;
          percentArr[idx] += 1;
        });
        setDots(newArr);
        const pArr = percentArr.map((item) =>
          parseInt(Math.round((item / newArr.length) * 100)),
        );
        console.log(pArr, newArr);
        setPercent(pArr);
      }
    }
  }, [res]);

  // 소켓 해제
  const changeInterval = () => {
    setXinter(0);
    setYinter(0);
    setZinter(0);
    setDots(-1);
    clearInterval(intervalId);
    setIntervalId(-1);
    skt.close();
    setSkt(null);
  };

  return (
    <Box>
      {dots !== -1 &&
        dots !== undefined &&
        dots.map((item, idx) => (
          <Circle
            top={item.y}
            left={item.x}
            key={idx}
            row={item.row}
            col={item.col}
          />
        ))}
      <Text h="36px" fontSize="md" textAlign="center" mt="8px">
        간격 설정(0 {'<'} x * y * z {'<'} 1000)
      </Text>
      <HStack h="30px" justifyContent="center">
        <HStack w="80%">
          <InputGroup>
            <InputLeftAddon children="x" />
            <Input
              type="number"
              value={xinter}
              onChange={(e) => setXinter(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children="y" />
            <Input
              type="number"
              value={yinter}
              onChange={(e) => setYinter(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children="z" />
            <Input
              type="number"
              value={zinter}
              onChange={(e) => setZinter(e.target.value)}
            />
          </InputGroup>
        </HStack>
      </HStack>
      <HStack h="15px" mt="25px" justifyContent="center">
        <Button onClick={submitInterval}>제출</Button>
        <Button onClick={changeInterval}>간격 재설정</Button>
      </HStack>
      <VStack mt="24px" spacing="40px">
        {boxes.map((hitem, idx) => (
          <HStack key={`row-${idx}`} spacing="32px">
            {hitem.map((box, jdx) => (
              <div>
                <Button
                  mt={idx !== 0 ? '50px' : 0}
                  bgColor={colorList[idx * 3 + jdx]}
                  key={`${idx}-${jdx}`}
                  w="80px"
                  h="90px"
                  // transform="scale(1.3)"
                />
                <Text h="12px" textAlign="center" fontSize="lg">
                  {percent[idx * 3 + jdx]}%
                </Text>
              </div>
            ))}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

export default DashBoard;
