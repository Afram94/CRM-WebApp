import React, { useState } from 'react';

const SendMessageForm = ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", marginTop: "20px" }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ flexGrow: 1, marginRight: "10px" }}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessageForm;
