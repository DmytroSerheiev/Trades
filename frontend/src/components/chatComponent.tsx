import { ChatBox, BtnWithIcon } from '@/styles/pnl.styles';
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

interface MessageProps {
  author: string;
  message: string;
}

const messagesData: MessageProps[] = [
  {
    author: 'receiver',
    message: 'Hey, did you see the latest earnings report?',
  },
  {
    author: 'receiver',
    message: 'Yes, it looks promising. The stock might go up.',
  },
  {
    author: 'receiver',
    message: "I'm thinking of buying some shares today.",
  },
  {
    author: 'receiver',
    message: 'Good idea. The market seems bullish.',
  },
  {
    author: 'sender',
    message: "What's your take on the current market trends?",
  },
  {
    author: 'receiver',
    message: "I believe it's a good time to invest in tech stocks.",
  },
  {
    author: 'receiver',
    message: "I'm considering shorting this stock, what do you think?",
  },
  {
    author: 'receiver',
    message: 'Be careful, it might rebound unexpectedly.',
  },
];

const ChatComponent = () => {
  const chatMessagesRef = useRef<HTMLElement | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<MessageProps[]>(messagesData);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to bottom when a new message is received
    scrollToBottom();
  }, [messages]); // Add dependency on messages state

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      // Check if input message is not empty
      const newMessage = { author: 'sender', message: inputMessage.trim() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage(''); // Clear input field after sending message
    }
  };

  useEffect(() => {
    const handleEnterPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };
    window.addEventListener('keydown', handleEnterPress);

    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, [inputMessage]);

  return (
    <ChatBox>
      <Box className="header_nav">
        <header>New Chat</header>
        <BtnWithIcon>
          <img src="/newChatIcon.svg" alt="send" />
        </BtnWithIcon>
      </Box>
      <Box className="chat_room">
        <Box className="chat_messages" ref={chatMessagesRef}>
          {messages.map((message, index: number) => (
            <Box
              key={index}
              className={
                message.author === 'sender' ? 'send_bubble' : 'received_bubble'
              }
            >
              {message.message}
            </Box>
          ))}
        </Box>

        <Box className="chat_input">
          <input
            type="text"
            placeholder="Type here"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)} // Update inputMessage state
          />
          <BtnWithIcon onClick={handleSendMessage}>
            <img src="/sendIcon.svg" alt="send" />
          </BtnWithIcon>
        </Box>
      </Box>
    </ChatBox>
  );
};

export default ChatComponent;
