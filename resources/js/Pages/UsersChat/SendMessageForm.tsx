import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import React, { useState } from 'react';

const SendMessageForm = ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form className='mx-5' onSubmit={handleSubmit} style={{ display: "flex", marginTop: "20px" }}>
      <TextInput
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ flexGrow: 1, marginRight: "10px" }}
      />
      <PrimaryButton type="submit">Send</PrimaryButton>
    </form>
  );
};

export default SendMessageForm;
