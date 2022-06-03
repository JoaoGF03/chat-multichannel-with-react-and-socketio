import React, { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client'

export interface IMessage {
  userName: string;
  message: string;
}

export interface IChannel {
  name: string;
  id: string;
  messages: IMessage[];
}

interface IChannelContext {
  channels: IChannel[];
  channel: IChannel | undefined;
  userName: string;

  createChannel(name: string): void;
  createMessage(message: string): void;
  login(userName: string): void;
  joinChannel(channelId: string): void;
}

export const ChannelContext = createContext<IChannelContext>({} as IChannelContext)

export const ChannelContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<Socket>()
  const [userName, setUserName] = useState('')
  const [channels, setChannels] = useState<IChannel[]>([])
  const [channel, setChannel] = useState<IChannel | undefined>()

  useEffect(() => {
    socket.current = io('http://localhost:3333')

    socket.current.on('channels:get', data => {
      setChannels(data)
    })

    socket.current.on('channel:get', channel => {
      setChannel(channel)
    })
  }, [])

  const createChannel = (channelName: string) => {
    socket.current?.emit('channel:create', channelName)
  }

  const createMessage = (message: string) => {
    socket.current?.emit('message:create', { message, channelId: channel?.id, userName })
  }

  const login = (userName: string) => {
    socket.current?.emit('user:login', userName)

    setUserName(userName)
  }

  const joinChannel = (channelId: string) => {
    socket.current?.emit('channel:join', channelId)
  }

  return (
    <ChannelContext.Provider value={{
      channels,
      channel,
      userName,
      createChannel,
      createMessage,
      login,
      joinChannel
    }}>
      {children}
    </ChannelContext.Provider>
  )
}