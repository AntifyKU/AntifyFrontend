import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/config/api';

// Use the same base URL as the REST API for WebSocket connection
const SOCKET_URL = API_BASE_URL;

export type ChatMessage = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    isStreaming?: boolean;
};

type UseChatbotReturn = {
    messages: ChatMessage[];
    isConnected: boolean;
    isTyping: boolean;
    sendMessage: (text: string) => void;
    sendMessageWithImage: (text: string, imageBase64: string, mimeType: string) => void;
    clearMessages: () => void;
};

export function useChatbot(initialMessage?: string): UseChatbotReturn {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        if (initialMessage) {
            return [{
                id: '1',
                text: initialMessage,
                isUser: false,
                timestamp: new Date(),
            }];
        }
        return [];
    });
    const streamingMessageRef = useRef<string>('');

    useEffect(() => {
        // Initialize socket connection
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('🔌 Connected to chatbot server');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('🔌 Disconnected from chatbot server');
            setIsConnected(false);
        });

        socket.on('response', (chunk: string) => {
            streamingMessageRef.current += chunk;

            // Update the last message (streaming response)
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];

                if (lastMessage && !lastMessage.isUser && lastMessage.isStreaming) {
                    lastMessage.text = streamingMessageRef.current;
                }

                return newMessages;
            });
        });

        socket.on('response_complete', () => {
            setIsTyping(false);
            streamingMessageRef.current = '';

            // Mark streaming as complete
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];

                if (lastMessage && !lastMessage.isUser) {
                    lastMessage.isStreaming = false;
                }

                return newMessages;
            });
        });

        socket.on('error', (err: { message: string }) => {
            console.error('Socket error:', err);
            setIsTyping(false);
            streamingMessageRef.current = '';

            // Add error message
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];

                if (lastMessage && !lastMessage.isUser && lastMessage.isStreaming) {
                    lastMessage.text = `Error: ${err.message}`;
                    lastMessage.isStreaming = false;
                } else {
                    newMessages.push({
                        id: Date.now().toString(),
                        text: `Error: ${err.message}`,
                        isUser: false,
                        timestamp: new Date(),
                    });
                }

                return newMessages;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = useCallback((text: string) => {
        if (!text.trim() || !socketRef.current) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text,
            isUser: true,
            timestamp: new Date(),
        };

        // Add placeholder for bot response
        const botPlaceholder: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: '',
            isUser: false,
            timestamp: new Date(),
            isStreaming: true,
        };

        setMessages(prev => [...prev, userMessage, botPlaceholder]);
        setIsTyping(true);
        streamingMessageRef.current = '';

        // Build conversation history for context
        const conversationHistory = messages
            .filter(m => !m.isStreaming)
            .map(m => ({
                content: m.text,
                role: m.isUser ? 'user' as const : 'assistant' as const,
                timestamp: m.timestamp,
            }));

        // Send to server
        socketRef.current.emit('message', {
            content: text,
            conversationHistory,
        });
    }, [messages]);

    const sendMessageWithImage = useCallback((
        text: string,
        imageBase64: string,
        mimeType: string
    ) => {
        if (!text.trim() || !socketRef.current) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: `📷 ${text}`,
            isUser: true,
            timestamp: new Date(),
        };

        // Add placeholder for bot response
        const botPlaceholder: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: '',
            isUser: false,
            timestamp: new Date(),
            isStreaming: true,
        };

        setMessages(prev => [...prev, userMessage, botPlaceholder]);
        setIsTyping(true);
        streamingMessageRef.current = '';

        // Send to server with image
        socketRef.current.emit('message_with_image', {
            content: text,
            imageBase64,
            imageMimeType: mimeType,
        });
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        isConnected,
        isTyping,
        sendMessage,
        sendMessageWithImage,
        clearMessages,
    };
}
