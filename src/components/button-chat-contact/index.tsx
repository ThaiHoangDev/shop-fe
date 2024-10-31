import React, { useEffect, useState } from 'react';
import { Box, Button, Fab, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import CancelIcon from '@mui/icons-material/Cancel';
import CallIcon from '@mui/icons-material/Call';

const BoxContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  cursor: 'pointer',
}));

const WrapBoxContact = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  cursor: 'pointer',
}));

const ButtonGroupWrapper = styled(Stack)(({ theme }) => ({
  position: 'fixed',
  right: '20px',
  bottom: '80px',
  cursor: 'pointer',
  // [theme.breakpoints.down('sm')]: {
  //   right: '7vw',
  //   bottom: '11vh',
  // },

  // [theme.breakpoints.down('lg')]: {
  //   bottom: '9vh',
  //   right: '4vw',
  // },
}));

const ButtonCallPhone = styled(Fab)(({ theme }) => ({
  color: '#ffff',
  width: '60px',
  height: '60px',
}));

export default function ButtonChatContact() {
  const [isOpenMessenger, setIsOpenMessenger] = useState<boolean>(false);

  //   useEffect(() => {
  //     const delay = isOpenMessenger ? 5000 : 0;
  //     // const timeoutId = setTimeout(() => setVisible(isOpenMessenger), delay);
  //     return () => clearTimeout(timeoutId);
  //   }, [isOpenMessenger]);

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 10,
      }}>
      {/* {isOpenMessenger ? (
        <>
          <BoxContainer onClick={() => setIsOpenMessenger(false)}>
            <Box
              sx={{
                backgroundColor: '#87B44B',
                padding: '10px 10px 5px',
                borderRadius: '50%',
              }}>
              <CancelIcon sx={{ color: '#ffff', fontSize: '30px' }} />
            </Box>
          </BoxContainer>

          <WrapBoxContact sx={{}}></WrapBoxContact>
        </>
      ) : (
        <>
          <BoxContainer onClick={() => setIsOpenMessenger(true)}>
            <Box
              sx={{
                backgroundColor: '#87B44B',
                padding: '10px 10px 5px',
                borderRadius: '50%',
              }}>
              <ChatIcon
                sx={{
                  color: '#ffff',
                  fontSize: '30px',
                }}
              />
            </Box>
          </BoxContainer>
          <Box
            sx={{
              display: 'none',
            }}
          />
        </>
      )} */}

      <ButtonGroupWrapper>
        <a href='tel:+84974741010'>
          <ButtonCallPhone color={'primary'}>
            <CallIcon />
          </ButtonCallPhone>
        </a>
        <Button>
          <div id='fb-root' />
          <div id='fb-customer-chat' className='fb-customerchat' />
        </Button>
      </ButtonGroupWrapper>
    </Box>
  );
}
