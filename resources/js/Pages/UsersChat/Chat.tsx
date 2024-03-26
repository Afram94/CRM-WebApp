import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import UserList from './UserList';
import MainLayout from '@/Layouts/MainLayout';
import { useEcho } from '../../../providers/WebSocketContext';
import { Message } from '@/types';
import { format } from 'date-fns';

import { MdDelete, MdSearch, MdVideoCall } from 'react-icons/md';

interface IMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  message: string;
  isSender?: boolean;
  created_at?: any;
}

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [toUserId, setToUserId] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // State to hold the current user's ID
  const [userName, setUserName] = useState<string | null>(null); // State to hold the current user's Name
  const echo = useEcho();

  const messagesEndRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Depend on messages
  



  useEffect(() => {
    // Fetch current user ID
    const fetchUser = async () => {
      try {
        const response = await axios.get('/current-user');
        setUserId(response.data.id); // Set the current user ID
        setUserName(response.data.name); // Set the current user ID
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();

    const storedToUserId = localStorage.getItem('toUserId');
    if (storedToUserId) {
      setToUserId(storedToUserId);
    }
  }, []); // Empty dependency array means this runs once on component mount

  useEffect(() => {
    if (!toUserId || !userId) {
      console.log('No user selected for chat, or current user ID not determined.');
      return;
    }
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/chat/fetch-messages/${toUserId}`);
        if (Array.isArray(response.data.messages)) {
          const formattedMessages = response.data.messages.map((msg: IMessage) => ({
            ...msg,
            isSender: msg.from_user_id === userId,
            createdAt: format(new Date(msg.created_at), 'p'),
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Fetching messages failed: ", error);
      }
    };
    fetchMessages();





    /* if (!toUserId) {
      console.log('No user selected for chat.');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/fetch-messages/${toUserId}`);
        if (Array.isArray(response.data.messages)) {
          const formattedMessages = response.data.messages.map((msg: IMessage) => ({
            ...msg,
            isSender: msg.from_user_id === userId,
            createdAt: format(new Date(msg.created_at), 'p') // 'p' is for formatting as 'local time'
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Fetching messages failed: ", error);
      }
    };

    fetchMessages(); */




    /* // Subscribe to Echo channel for real-time messages
    if (echo && userId) {
        const userChannelMessage = echo.private(`chat.${userId}`)
        .listen('.NewChatMessage', (e: { message: Message }) => {
          setMessages((prevMessages) => [...prevMessages, { ...e.message, isSender: e.message.from_user_id === userId }]);
          console.log("here_1");
        });

      return () => {
        
        console.log("here_2");
        userChannelMessage.stopListening('NewChatMessage')
      };
    } */



  }, [toUserId, userId]); // Depend on userId to re-fetch messages when it changes



  /* useEffect(() => {
    if (echo && userId) {
      const userChannel = echo.private(`chat.${userId}`)
        .listen('.NewChatMessage', (e: { message: Message }) => {
          const incomingMessage = e.message;
          const isSender = incomingMessage.from_user_id === userId;
          setMessages(prevMessages => [...prevMessages, { ...incomingMessage, isSender }]);
        });

        return () => {
            console.log("here_2");
            userChannel.stopListening('NewChatMessage')
          };
    }
  }, [echo, userId]); */

  /* useEffect(() => {
    if (echo && userId) {
        // Listen to the chat channel for the logged-in user
        const channelName = `chat.${userId}`;
        const channel = echo.private(channelName);
        console.log("here_111");
        channel.listen('.App\\Events\\NewChatMessage', (e: { message: Message }) => {
          console.log("here_1");
            const incomingMessage = {
                ...e.message,
                isSender: e.message.from_user_id === userId,
            };
            setMessages(prevMessages => [...prevMessages, incomingMessage]);
        });

        return () => {
          console.log("here_2");
          echo.leave(`chat.${userId}`);
      };
      
    }
}, [echo, userId]); // Re-subscribe when `echo` or `userId` changes */

    useEffect(() => {
      if (echo && userId) {
        const channelName = `chat.${userId}`;
        const channel = echo.private(channelName);

        // Listening for the 'NewChatMessage' event. 
        channel.listen('.App\\Events\\NewChatMessage', (e: { message: Message }) => {
          // Here, we check if the incoming message is not sent by the current user. 
          // This prevents showing the message twice since we're optimistically adding messages 
          // to the state when they're sent.
          if (e.message.from_user_id !== userId && e.message.to_user_id === userId) {
            const incomingMessage = {
              ...e.message,
              isSender: false,
            };
            // Add the incoming message to the state only if it's from another user.
            setMessages(prevMessages => [...prevMessages, incomingMessage]);
          }
        });

        // Clean-up function: Leaves the chat channel when the component unmounts
        // or when the userId changes to prevent memory leaks.
        return () => {
          echo.leave(channelName);
        };    
      }
      // Note: We no longer include messages in the dependencies array because 
      // it can cause the effect to run multiple times unnecessarily which could lead 
      // to multiple subscriptions to the same channel.
    }, [echo, userId]);


    





    const handleSendMessage = (messageText: string) => {
      if (!toUserId || !userId) {
        console.error("No recipient or sender identified.");
        return;
      }
    
      // Generating a temporary unique ID for the optimistic message
      const optimisticMessage = {
        id: Date.now(),
        from_user_id: userId,
        to_user_id: parseInt(toUserId),
        message: messageText,
        isSender: true,
      };
    
      // Optimistically add the message to the UI. 
      // This assumes the message will be sent successfully and provides instant feedback to the user.
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    
      // Sending the actual message to the server.
      axios.post('/chat/send-message', {
        to_user_id: toUserId,
        message: messageText
      })
      .then(response => {
        // When the server confirms the message, update the message with the confirmed ID from the server.
        // This replaces the temporary ID with the actual ID assigned by the database.
        setMessages(prevMessages =>
          prevMessages.map(m => (m.id === optimisticMessage.id ? { ...m, id: response.data.data.id } : m))
        );
      })
      .catch(error => {
        console.error("Sending message failed: ", error);
        // If there's an error sending the message, remove the optimistic message from the state.
        setMessages(prevMessages => prevMessages.filter(m => m.id !== optimisticMessage.id));
      });
    };
    


  const handleSelectUser = (userId: string) => {
    setToUserId(userId);
    setMessages([]); // Clear messages when switching users
    localStorage.setItem('toUserId', userId); // Store the selected user ID in localStorage
  };


  const handleDeleteMessage = async (messageId : any) => {
    try {
      await axios.delete(`/chat/delete-message/${messageId}`);
      setMessages(messages.filter(message => message.id !== messageId));
    } catch (error) {
      console.error("Deleting message failed: ", error);
    }
  };

  return (
    <MainLayout title="Chat" css=''>
        <div>
          
          <div className='bg-slate-100 dark:bg-[#232332] rounded-lg opacity-90 flex h-[800px]' /* style={{ height: '100vh' }} */> {/* 100vh */}

            <div className='' style={{ width: '30%', height: '100%', overflowY: 'auto', borderRight: '1px solid #ccc' }}>
              <UserList onSelectUser={handleSelectUser} selectedUserId={toUserId} />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

                <div className='flex justify-between items-center dark:bg-[#2B2C3F] bg-indigo-500 dark:text-slate-300 text-indigo-100 py-2 px-3 font-bold'>
                  <div>
                    {userName} - <p className='text-sm dark:bg-slate-400 bg-white text-center rounded-lg py-1 px-3 w-fit text-indigo-500 dark:text-slate-700 mt-1'>Developer</p>
                  </div>
                <div className='flex dark:text-slate-300 text-indigo-100'>
                  <MdSearch className=" hover:text-indigo-300 cursor-pointer mx-2" size="24" title="Search" />
                  <MdVideoCall className=" hover:text-indigo-300 cursor-pointer mx-2" size="24" title="Start Video Call" />
                  <MdDelete className=" hover:text-indigo-300 cursor-pointer mx-2" size="24" title="Delete Chat" />
                </div>
              
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
              <MessageList messages={messages} endRef={messagesEndRef} handleDeleteMessage={handleDeleteMessage} />

              </div>

              <div className='py-3'>
                <SendMessageForm onSendMessage={handleSendMessage} />
              </div>
            </div>
          </div>

        </div>

    </MainLayout>
  );
};

export default Chat;
