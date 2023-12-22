import { name } from '@/atom';
import { insertDBAPI, readDBAPI } from '@/lib/api/db';
import { Button, Text, VStack, SlideFade, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

function Index() {
  const [phone, setPhone] = useState();
  const [grant, setGrant] = useState(false);
  const [uname, setUname] = useRecoilState(name);
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent.toLocaleLowerCase();

    if (userAgent.indexOf('android') > -1) {
      setPhone('android');
    } else if (
      userAgent.indexOf('iphone') > -1 ||
      userAgent.indexOf('ipad') > -1
    ) {
      setPhone('ios');
    } else {
      setPhone('whoru?');
    }
  }, []);

  const requestSensorAccess = () => {
    if (phone === 'ios') {
      window.DeviceMotionEvent.requestPermission().then((res) => {
        if (res === 'granted') {
          setGrant(true);
        }
      });
    } else if (phone === 'android') {
      if (window.DeviceMotionEvent) {
        setGrant(true);
      }
    }
  };

  const onLogin = async () => {
    const name = await readDBAPI('user', ['name']);
    const nameArr = name.data.map((item) => item.name);
    if (nameArr.includes(uname)) {
      router.push('/board');
    } else {
      const data = {
        name: uname,
      };
      const res = await insertDBAPI('user', data);
      console.log('res', res);
      router.push('/board');
    }
  };

  return (
    <div>
      <VStack p="200px 40px" gap={8}>
        <SlideFade
          in={true}
          offsetY="20px"
          transition={{ enter: { duration: 0.5 } }}
        >
          <Text fontSize="4xl" fontWeight="bold">
            Touch Data, 센서 허락을 해주세요.
          </Text>
        </SlideFade>
        <Input
          type="text"
          placeholder="ID"
          value={uname || ''}
          onChange={(e) => setUname(e.target.value)}
        />
        <Button
          isDisabled={true}
          colorScheme="blue"
          loadingText="Loading..."
          width="50%"
          onClick={onLogin}
        >
          Start!
        </Button>
        <Button onClick={requestSensorAccess} w="50%" colorScheme="whatsapp">
          Allow Sensor
        </Button>
        <Button
          colorScheme="blue"
          width="50%"
          onClick={onLogin}
          isDisabled={true}
        >
          Test
        </Button>
        <Button
          isDisabled={true}
          onClick={() => {
            router.push('/accer');
          }}
        >
          Go to Accer
        </Button>
        <Button
          isLoading={!grant}
          onClick={() => {
            router.push('/dashboard');
          }}
        >
          Go to Dashboard
        </Button>
      </VStack>
    </div>
  );
}

export default Index;
