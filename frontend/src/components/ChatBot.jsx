import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaUserMd, FaRobot, FaPaperPlane } from 'react-icons/fa';

const ChatBot = ({ initialContext }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  // URL API Backend (Lấy từ biến môi trường hoặc dùng mặc định)
  const API_URL = import.meta.env.VITE_API_URL || 'https://skinbe.onrender.com';

  // Hàm cuộn xuống cuối khung chat
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100); // Delay nhẹ để DOM kịp cập nhật
  };

  // Lời chào đầu tiên (Chạy 1 lần khi component hiện ra)
  useEffect(() => {
    let welcomeMsg = 'Xin chào! Tôi là trợ lý ảo hỗ trợ bạn.';
    if (initialContext) {
      // Dùng tên bệnh tiếng Việt nếu có
      welcomeMsg = `Dựa trên kết quả **${initialContext}**, bạn cần tôi tư vấn gì thêm không?`;
    }
    setMessages([{ text: welcomeMsg, isUser: false }]);
  }, [initialContext]);

  // Mỗi khi có tin nhắn mới -> cuộn xuống
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const text = userInput;
    // 1. Hiện tin nhắn người dùng
    setMessages(prev => [...prev, { text, isUser: true }]);
    setUserInput('');
    setIsLoading(true);

    try {
      // 2. Gọi API Chat
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: text,
        disease_context: initialContext // Gửi kèm ngữ cảnh bệnh
      });

      // 3. Hiện trả lời của AI
      setMessages(prev => [...prev, { text: res.data.reply, isUser: false }]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { text: 'Xin lỗi, kết nối bị gián đoạn. Bạn thử lại nhé!', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 flex items-center gap-3 shadow-md">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm border-2 border-teal-100">
          <FaUserMd />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Trợ lý DermAssist</h3>
          <p className="text-teal-100 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
            Sử dụng Gemini Pro
          </p>
        </div>
      </div>

      {/* Khung tin nhắn */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 scroll-smooth" ref={messagesContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>

            {/* Icon Robot (Nếu không phải user) */}
            {!msg.isUser && (
              <div className="w-8 h-8 mr-2 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xs flex-shrink-0 border border-teal-200">
                 <FaRobot />
              </div>
            )}

            {/* Bong bóng tin nhắn */}
            <div className={`max-w-[80%] p-3 text-sm shadow-sm leading-relaxed ${
              msg.isUser
                ? 'bg-teal-600 text-white rounded-2xl rounded-br-none'
                : 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-none'
            }`}>
              {/* Hỗ trợ render markdown cơ bản (in đậm) */}
              {msg.text.split('**').map((chunk, i) =>
                i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk
              )}
            </div>
          </div>
        ))}

        {/* Hiệu ứng đang gõ... */}
        {isLoading && (
          <div className="flex justify-start items-center ml-10">
            <div className="bg-slate-200 p-2 rounded-full flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input nhập liệu */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={sendMessage} className="relative">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            type="text"
            placeholder="Hỏi thêm về bệnh..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm text-slate-700 outline-none"
            disabled={isLoading}
          />
          <button type="submit"
                  className="absolute right-2 top-2 w-8 h-8 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!userInput.trim() || isLoading}>
            <FaPaperPlane className="text-xs" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
