import { name } from '@/atom';
import { insertDBAPI, readDBAPI } from '@/lib/api/db';
import { Button, Text, VStack, SlideFade, Input } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

function Index() {
  const [phone, setPhone] = useState();
  const [grant, setGrant] = useState(false);
  const [uname, setUname] = useRecoilState(name);

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
    // 1. 이름이 db에 존재하는지 확인
    // const name = await readDBAPI('user', ['name']);
    // 2. 없으면 새로 등록
    if (!false) {
      const data = {
        name: uname,
      };
      console.log('sdf');
      const res = await insertDBAPI('user', data);
      console.log('res', res);
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
            Touch Data
          </Text>
        </SlideFade>
        <Input
          type="text"
          placeholder="ID"
          value={uname || ''}
          onChange={(e) => setUname(e.target.value)}
        />
        {/* <Button
          isLoading={!grant}
          colorScheme="blue"
          loadingText="Loading..."
          width="50%"
          // TODO: Server API로
          onClick={async () => {
            const client = await dbUtil.psql.makeClient();
            await dbUtil.psql.insertDB(client, 'public', 'user', {
              name: uname,
            });
            await dbUtil.psql.deleteClient(client);
          }}
        >
          Start!
        </Button> */}
        <Button onClick={requestSensorAccess} w="50%" colorScheme="whatsapp">
          Allow Sensor
        </Button>
        <Button
          colorScheme="blue"
          width="50%"
          // TODO: Server API로
          onClick={onLogin}
        >
          Test
        </Button>
      </VStack>
    </div>
  );
}

export default Index;
