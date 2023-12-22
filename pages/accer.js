import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

function Accer() {
  const [accerData, setAccerData] = useState(null);
  const [gyroData, setGyroData] = useState(null);
  const [accSum, setAccSum] = useState(null);
  const [angle, setAngle] = useState(null);
  const handleDeviceMotion = (event) => {
    const { alpha, beta, gamma } = event.rotationRate;
    const { x, y, z } = event.accelerationIncludingGravity;
    setGyroData({ alpha, beta, gamma });
    setAccerData({ x, y, z });
    setAccSum(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)));
    setAngle({
      x: Math.acos(
        x / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)),
      ),
      y: Math.acos(
        y / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)),
      ),
      z: Math.acos(
        z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)),
      ),
    });
  };

  useEffect(() => {
    window.addEventListener('devicemotion', handleDeviceMotion);
  }, []);
  return (
    <Box>
      <Text>가속도센서</Text>
      {accerData && (
        <div>
          <Text>x: {accerData.x}</Text>
          <Text>y: {accerData.y}</Text>
          <Text>z: {accerData.z}</Text>
          <Text>
            sum:
            {accSum}
          </Text>
          <Text>x angle: {angle.x}</Text>
          <Text>y angle: {angle.y}</Text>
          <Text>z angle: {angle.z}</Text>
        </div>
      )}
    </Box>
  );
}

export default Accer;
