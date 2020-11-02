import React from 'react'
import Sidebar from './Sidebar';
import OpenConversation from './OpenConversation';
import { useConversations } from '../contexts/ConversationsProvider';

export default function Dashboard({ id }) {
  const { selectedConversation } = useConversations()

  return (
    <div className="d-flex" style={{ height: '100vh'}}>
      <Sidebar id={id} />
      {
        selectedConversation?<OpenConversation />:<p className="lead w-75 mt-5 pt-5 text-center display-3">Start Your Chat</p>
      }
    </div>
  )
}
