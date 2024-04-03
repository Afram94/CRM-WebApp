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
    // Adjustments to SendMessageForm
    <form className='mx-5' onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
      <TextInput
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ flexGrow: 1, marginRight: "10px", padding: "10px", fontSize: "1rem" }}
        placeholder="Type your message here..."
      />
      <PrimaryButton type="submit" style={{ padding: "10px 20px", fontSize: "1rem" }}>
        <i className="fas fa-paper-plane">Send</i> {/* Assuming you're using Font Awesome */}
      </PrimaryButton>
    </form>

  );
};

export default SendMessageForm;
