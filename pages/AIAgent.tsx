import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '../components/UI';
import { Send, Bot, User, Loader2, FileText, Sparkles, MessageSquare, Filter, X, Calendar, UserCircle, Tag, FolderTree, FileType } from 'lucide-react';
import { KMSService } from '../services/kmsService';
import { Category } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  documents?: {
    id: string;
    title: string;
    snippet: string;
    relevance: number;
  }[];
}

interface SearchFilters {
  dateFrom?: string;
  dateTo?: string;
  author?: string;
  fileType?: string;
  tags?: string;
  categoryId?: string;
}

export const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào! Tôi là AI Agent của hệ thống KMS. Tôi có thể giúp bạn tìm kiếm tài liệu, trả lời câu hỏi về nội dung tài liệu và gợi ý thông tin liên quan. Bạn có thể sử dụng bộ lọc để tìm kiếm chính xác hơn. Bạn muốn tìm kiếm gì hôm nay?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await KMSService.getCategories();
    setCategories(cats);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in real app, call backend API with filters)
    setTimeout(() => {
      const filterInfo = activeFiltersCount > 0 
        ? ` (với ${activeFiltersCount} bộ lọc đã áp dụng)`
        : '';
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: simulateAIResponse(input) + filterInfo,
        timestamp: new Date().toISOString(),
        documents: getMockDocuments(input)
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const simulateAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('iso') || lowerQuery.includes('quy trình')) {
      return 'Tôi tìm thấy một số tài liệu về quy trình ISO 9001:2015. Đây là tiêu chuẩn quản lý chất lượng được áp dụng rộng rãi. Dưới đây là các tài liệu liên quan:';
    }
    
    if (lowerQuery.includes('nhân sự') || lowerQuery.includes('hr')) {
      return 'Về chính sách nhân sự, tôi tìm thấy các tài liệu sau đây có thể hữu ích cho bạn:';
    }
    
    if (lowerQuery.includes('tài chính') || lowerQuery.includes('báo cáo')) {
      return 'Dưới đây là các báo cáo tài chính và tài liệu liên quan mà bạn có thể tham khảo:';
    }
    
    return `Tôi đã tìm kiếm theo yêu cầu "${query}" và tìm thấy các tài liệu liên quan sau. Bạn có thể click vào để xem chi tiết:`;
  };

  const getMockDocuments = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('iso')) {
      return [
        {
          id: 'd5',
          title: 'Quy trình ISO 9001:2015',
          snippet: 'Hướng dẫn triển khai hệ thống quản lý chất lượng, quy trình kiểm soát và cải tiến liên tục theo tiêu chuẩn ISO 9001:2015...',
          relevance: 0.95
        },
        {
          id: 'd1',
          title: 'Lộ trình phát triển Quý 3/2024',
          snippet: 'Chi tiết lộ trình sản phẩm bao gồm cải tiến quy trình theo chuẩn ISO...',
          relevance: 0.78
        }
      ];
    }
    
    if (lowerQuery.includes('nhân sự') || lowerQuery.includes('hr')) {
      return [
        {
          id: 'd2',
          title: 'Sổ tay nhân viên 2023',
          snippet: 'Quy định nội bộ, chính sách nhân sự, quy trình nghỉ phép và đãi ngộ áp dụng trong năm 2023...',
          relevance: 0.92
        },
        {
          id: 'appr2',
          title: 'Hướng dẫn Onboarding Nhân viên mới',
          snippet: 'Checklist và timeline cho quá trình onboarding từ ngày 1 đến ngày 90...',
          relevance: 0.85
        }
      ];
    }
    
    return [
      {
        id: 'd4',
        title: 'Báo cáo tài chính Q2',
        snippet: 'Báo cáo tổng hợp doanh thu, chi phí và lợi nhuận quý 2/2024...',
        relevance: 0.88
      },
      {
        id: 'd3',
        title: 'Đặc tả Dự án Alpha',
        snippet: 'Yêu cầu kỹ thuật cho dự án Alpha, kiến trúc hệ thống và acceptance criteria...',
        relevance: 0.72
      }
    ];
  };

  const suggestedQuestions = [
    'Tìm tài liệu về quy trình ISO 9001',
    'Chính sách nghỉ phép mới nhất',
    'Báo cáo tài chính quý gần nhất',
    'Hướng dẫn onboarding nhân viên mới'
  ];

  const clearFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Agent</h1>
              <p className="text-sm text-gray-500">Tìm kiếm thông minh với AI - Hỏi đáp về tài liệu</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-4 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Bộ lọc tìm kiếm nâng cao</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Xóa tất cả
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Từ ngày
              </label>
              <input
                type="date"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Đến ngày
              </label>
              <input
                type="date"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FolderTree className="w-3 h-3" />
                Danh mục
              </label>
              <select
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                value={filters.categoryId || ''}
                onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <UserCircle className="w-3 h-3" />
                Tác giả
              </label>
              <input
                type="text"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                placeholder="Nhập tên tác giả..."
                value={filters.author || ''}
                onChange={(e) => setFilters({ ...filters, author: e.target.value })}
              />
            </div>

            {/* File Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FileType className="w-3 h-3" />
                Loại file
              </label>
              <select
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                value={filters.fileType || ''}
                onChange={(e) => setFilters({ ...filters, fileType: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="xlsx">XLSX</option>
                <option value="pptx">PPTX</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Tags
              </label>
              <input
                type="text"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                placeholder="VD: iso, training..."
                value={filters.tags || ''}
                onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
              />
            </div>
          </div>
          
          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {filters.dateFrom && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Từ: {new Date(filters.dateFrom).toLocaleDateString('vi-VN')}
                    <button onClick={() => setFilters({ ...filters, dateFrom: '' })} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.dateTo && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Đến: {new Date(filters.dateTo).toLocaleDateString('vi-VN')}
                    <button onClick={() => setFilters({ ...filters, dateTo: '' })} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.categoryId && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Danh mục: {categories.find(c => c.id === filters.categoryId)?.name}
                    <button onClick={() => setFilters({ ...filters, categoryId: '' })} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.author && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Tác giả: {filters.author}
                    <button onClick={() => setFilters({ ...filters, author: '' })} className="hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.fileType && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Loại: {filters.fileType.toUpperCase()}
                    <button onClick={() => setFilters({ ...filters, fileType: '' })} className="hover:text-yellow-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.tags && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                    Tags: {filters.tags}
                    <button onClick={() => setFilters({ ...filters, tags: '' })} className="hover:text-pink-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`max-w-2xl ${message.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {/* Document Results */}
                {message.documents && message.documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.location.hash = `/documents/${doc.id}`}
                      >
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
                              <span className="text-xs text-green-600 font-semibold">
                                {Math.round(doc.relevance * 100)}% liên quan
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{doc.snippet}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">Đang tìm kiếm...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gợi ý câu hỏi:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1.5 hover:bg-gray-50 hover:border-orange-300 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập câu hỏi của bạn... (VD: Tìm tài liệu về ISO 9001)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gửi
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Mẹo: Hỏi cụ thể để có kết quả chính xác hơn. VD: "Tìm quy trình ISO mới nhất" thay vì chỉ "ISO"
          </p>
        </div>
      </Card>
    </div>
  );
};
