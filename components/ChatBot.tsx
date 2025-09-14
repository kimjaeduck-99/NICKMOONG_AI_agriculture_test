import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isAI?: boolean;
}

const farmingFAQ = [
  {
    keywords: ['토마토', '잎마름병', '병해'],
    response: '토마토 잎마름병은 습도가 높을 때 발생하기 쉽습니다. 구리계 살균제를 7-10일 간격으로 살포하고, 통풍을 개선해주세요. 물주기는 아침 시간대에 하는 것이 좋습니다.'
  },
  {
    keywords: ['시세', '가격', '농산물'],
    response: '실시간 농산물 시세는 왼쪽 패널에서 확인하실 수 있습니다. 고추, 마늘, 양파 등 주요 농산물의 가격 동향을 실시간으로 모니터링할 수 있어요.'
  },
  {
    keywords: ['물', '물주기', '관수'],
    response: '작물별 물 관리 방법이 다릅니다. 일반적으로 아침 시간대(오전 6-9시)에 주는 것이 좋고, 토양 표면이 마를 때 충분히 주세요. 과습은 병해의 원인이 됩니다.'
  },
  {
    keywords: ['비료', '영양', '거름'],
    response: '작물 생육 단계별로 필요한 비료가 다릅니다. 질소(N)는 잎 생장에, 인산(P)은 뿌리와 꽃에, 칼륨(K)은 과실 발육에 중요합니다. 토양 검사를 통해 적정량을 시비하세요.'
  },
  {
    keywords: ['날씨', '기상', '온도'],
    response: '현재 날씨 정보는 오른쪽 패널에서 확인하실 수 있습니다. 급격한 온도 변화나 습도 변화는 작물에 스트레스를 줄 수 있으니 주의 깊게 관찰해주세요.'
  }
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 농업 AI 어시스턴트입니다. 🌱 작물 관리, 병해충 방제, 시세 정보 등 궁금한 점이 있으시면 언제든 물어보세요!\n\n💡 Google AI (Gemini) 모델이 연동되어 더욱 정확한 답변을 제공해드립니다.',
      sender: 'bot',
      timestamp: new Date(),
      isAI: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 5초 후 펄스 효과 끄기
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // AI 연결 상태 확인
  useEffect(() => {
    checkAIConnection();
  }, []);

  const checkAIConnection = async () => {
    try {
      // 먼저 서버 헬스체크
      const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6ba9087f/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!healthResponse.ok) {
        console.log('Server health check failed:', healthResponse.status);
        setAiStatus('disconnected');
        return;
      }

      // 실제 AI 서비스 테스트
      const testResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6ba9087f/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          message: '테스트',
          context: 'AI 연결 테스트'
        })
      });

      if (testResponse.ok) {
        const data = await testResponse.json();
        if (data.response) {
          setAiStatus('connected');
        } else {
          setAiStatus('disconnected');
        }
      } else {
        const errorData = await testResponse.json();
        console.log('AI service test failed:', errorData);
        
        if (errorData.error && errorData.error.includes('API key')) {
          // API 키 문제인 경우 사용자에게 알림
          setMessages(prev => [...prev, {
            id: 'api-key-error',
            text: '⚠️ Google AI API 키가 설정되지 않았습니다.\n\n설정 방법:\n1. Google AI Studio에서 API 키 발급\n2. 프로젝트 설정에서 API 키 업로드\n3. 농업 AI 서비스 자동 활성화',
            sender: 'bot',
            timestamp: new Date(),
            isAI: false
          }]);
        }
        setAiStatus('disconnected');
      }
    } catch (error) {
      console.log('Connection check error:', error);
      setAiStatus('disconnected');
    }
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6ba9087f/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          message: userMessage,
          context: '농업 AI 챗봇 상담'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('AI API Error:', errorData);
        setAiStatus('disconnected');
        return generateLocalResponse(userMessage);
      }

      const data = await response.json();
      setAiStatus('connected');
      return data.response || generateLocalResponse(userMessage);
      
    } catch (error) {
      console.log('AI Chat Error:', error);
      setAiStatus('disconnected');
      return generateLocalResponse(userMessage);
    }
  };

  const generateLocalResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // FAQ 검색
    for (const faq of farmingFAQ) {
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return `🔍 기본 정보: ${faq.response}\n\n⚠️ AI 서비스가 일시적으로 연결되지 않아 기본 정보를 제공했습니다.`;
      }
    }

    // 기본 응답들
    if (lowerMessage.includes('안녕') || lowerMessage.includes('처음')) {
      return '안녕하세요! 농업에 관한 어떤 것이든 도움드릴 수 있습니다. 작물 진단, 재배 방법, 병해충 방제 등 궁금한 점을 말씀해주세요.\n\n⚠️ AI 서비스 연결을 확인 중입니다.';
    }

    if (lowerMessage.includes('도움') || lowerMessage.includes('뭐')) {
      return '다음과 같은 분야에서 도움을 드릴 수 있습니다:\n\n🌱 작물 재배 방법\n🐛 병해충 진단 및 방제\n💰 농산물 시세 정보\n💧 물 관리 방법\n🌡️ 날씨와 농업의 관계\n\n구체적인 질문을 해주시면 더 자세한 답변을 드릴게요!';
    }

    return '죄송합니다. AI 서비스에 일시적으로 연결할 수 없습니다. 기본 정보를 제공해드리겠습니다.\n\n📞 농업 관련 전문 상담:\n• 농촌진흥청: 1588-9999\n• 지역 농업기술센터 문의\n• 농약안전정보시스템: psis.go.kr';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // AI 응답 생성
      const response = await generateBotResponse(currentInput);
      
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date(),
          isAI: aiStatus === 'connected'
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, Math.random() * 1000 + 500);
    } catch (error) {
      setTimeout(() => {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          sender: 'bot',
          timestamp: new Date(),
          isAI: false
        };

        setMessages(prev => [...prev, errorResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-[60]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className={`relative ${showPulse ? 'animate-pulse' : ''}`}>
          <Button
            onClick={() => {
              setIsOpen(true);
              setShowPulse(false);
            }}
            className={`w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 shadow-xl border-2 border-white flex items-center justify-center transition-all duration-300 ${
              showPulse ? 'shadow-green-400/50 shadow-2xl' : ''
            }`}
            style={{ display: isOpen ? 'none' : 'flex' }}
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </Button>
          
          {/* 애니메이션 링 */}
          {showPulse && (
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-75"></div>
          )}
          
          {/* AI 상태 표시 */}
          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white ${
            aiStatus === 'connected' ? 'bg-blue-500' : 
            aiStatus === 'disconnected' ? 'bg-orange-500' : 'bg-gray-500'
          }`}>
            <span className="text-xs text-white font-bold">AI</span>
          </div>
        </div>
        
        {/* 툴팁 */}
        {showPulse && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            Google AI 농업 어시스턴트! 🌱
            <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-[60] w-80 lg:w-96 h-[450px] lg:h-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]"
          >
            <Card className="h-full flex flex-col shadow-xl border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  농업 AI 어시스턴트
                  {aiStatus === 'connected' && (
                    <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">Google AI</span>
                  )}
                  {aiStatus === 'disconnected' && (
                    <AlertCircle className="w-4 h-4 text-orange-300" />
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-700 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* AI 상태 표시 */}
                {aiStatus === 'disconnected' && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 p-3 mx-4 mt-2 rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-orange-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-orange-700 font-medium">
                            Google AI 연결 실패 📡
                          </p>
                          <p className="text-xs text-orange-600 mt-1">
                            Google AI API 키가 설정되지 않았습니다.<br/>
                            현재는 기본 FAQ로 응답 중입니다.
                          </p>
                          <p className="text-xs text-blue-600 mt-2 underline cursor-pointer" 
                             onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}>
                            → Google AI Studio에서 API 키 발급받기
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-300 hover:bg-orange-100 text-xs px-2 py-1"
                          onClick={checkAIConnection}
                        >
                          재시도
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`flex items-start gap-2 max-w-[80%] ${
                            message.sender === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : message.isAI
                                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}
                          >
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.text}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {message.sender === 'bot' && message.isAI && (
                                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full ml-2">
                                  AI
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            aiStatus === 'connected' 
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}>
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="농업 관련 질문을 입력하세요..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {aiStatus === 'connected' ? '🤖 Google AI로 강화된 답변' : '📚 기본 FAQ 기반 답변'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}