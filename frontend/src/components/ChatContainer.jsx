import React, { useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'
const ChatContainer = () => {
  const {messages,getMessages,isMessagesLoading,selectedUser} = useChatStore()
  const {subscribeToMessage ,unsubscribeFromMessages} =  useChatStore()
  const {authUser} = useAuthStore()
  const messageRef = useRef(null)
 useEffect(() => {
  if (!selectedUser?._id) return;

  getMessages(selectedUser._id);
  subscribeToMessage();

  return () => {
    unsubscribeFromMessages();
  };
}, [selectedUser?._id]); 


useEffect(() => {
  if (messageRef.current) {
    messageRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages.length]); 


  if(isMessagesLoading) return (
    <div className='flex flex-1 flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {messages.map((message)=>(
            <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageRef}
            >
              <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="profilepic" />
              </div>
              </div>
              <div className='chat-header mb-1'>
                <time className='text-xs opacity-50 ml-1'>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
              {message.image && (
                <img src={message.image} alt="attachmnet" className='sm:max-w-[200px] rounded-mb mb-2' />
              )}
              {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer
