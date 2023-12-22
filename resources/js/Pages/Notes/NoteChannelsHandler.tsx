import React, { useEffect, useState } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { Note, PageProps } from '@/types';

interface NoteChannelsHandlerProps {
    userId: number | null;
    parentId: number | null;
    onNewNote: (note: Note) => void;
    onUpdateNote: (note: Note) => void;
    onDeleteNote: (note: number) => void;
}

const NoteChannelsHandler: React.FC<NoteChannelsHandlerProps> = ({userId, parentId, onNewNote, onUpdateNote, onDeleteNote }) => {
  const echo = useEcho();


  useEffect(() => {
    if (echo && userId) {
        console.log("Create_1")
        const userChannel = echo.private(`notes-for-user-${userId}`)
        .listen('NoteCreated', (e: { note: Note }) => {
          onNewNote(e.note);
        });

        let parentChannel: any;
      if (parentId) {
        console.log("Create_2")
        parentChannel = echo.private(`notes-for-user-${parentId}`)
          .listen('NoteCreated', (e: { note: Note }) => {
            onNewNote(e.note);
          });
      }

        console.log("Update_1")
        const updateUserChannel = echo.private(`notes-for-user-${userId}`)
        .listen('UpdatedNote', (e: { note: Note }) => {
          onUpdateNote(e.note);
        });

        let updateParentChannel: any;
      if (parentId) {
        console.log("Update_2")
        updateParentChannel = echo.private(`notes-for-user-${parentId}`)
          .listen('UpdatedNote', (e: { note: Note }) => {
            onUpdateNote(e.note);
          });
      }

        console.log("Delete_1")
        const deleteUserChannel = echo.private(`notes-for-user-${userId}`)
        .listen('NoteDeleted', (e: { noteId: number }) => {
          onDeleteNote(e.noteId);
        });

        let deleteParentChannel: any;
      if (parentId) {
        console.log("Delete_2")
        deleteParentChannel = echo.private(`notes-for-user-${parentId}`)
          .listen('NoteDeleted', (e: { noteId: number }) => {
            onDeleteNote(e.noteId);
          });
      }

    

      // Cleanup function to unsubscribe from channels
      return () => {
        console.log("clear_1")
        userChannel.stopListening('NoteCreated');
        if (parentChannel) {
          console.log("clear_2")
          parentChannel.stopListening('NoteCreated');
        }
        
        console.log("Update_clear_1")
        updateUserChannel.stopListening('UpdatedNote');
        if (updateParentChannel) {
          console.log("Update_clear_2")
          updateParentChannel.stopListening('UpdatedNote');
        }

        console.log("Delete_clear_1")
        deleteUserChannel.stopListening('NoteDeleted');
        if (deleteParentChannel) {
          console.log("Delete_clear_2")
          deleteParentChannel.stopListening('NoteDeleted');
        }

      };
    }
  }, [echo, userId, onNewNote]);

  // This component doesn't render anything; it's just for setting up WebSocket subscriptions
  return null;
};

export default NoteChannelsHandler;
