
import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { KMSDocument, DocStatus, Category, Space, SearchFilters, User } from '../types';
import { Button, StatusBadge, Card } from '../components/UI';
import { Search, Filter, Calendar, FileText, Download, Sparkles, ChevronDown, ChevronRight, User as UserIcon, Tag, Globe, Layers, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<KMSDocument[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Search State
  const [filters, setFilters] = useState<SearchFilters>({
     query: '',
     categoryIds: [],
     spaceIds: [],
     tags: [],
     fileTypes: [],
     status: [],
     sortBy: 'relevance'
  });
  
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Facet Accordion State
  const [facetsOpen, setFacetsOpen] = useState({
     cat: true,
     space: true,
     tag: true,
     type: false,
     author: false,
     status: false,
     date: false
  });

  const toggleFacet = (facet: keyof typeof facetsOpen) => {
     setFacetsOpen(prev => ({ ...prev, [facet]: !prev[facet] }));
  };

  useEffect(() => {
    // Initial Load
    Promise.all([
      KMSService.getCategories(),
      KMSService.getSpaces(),
      KMSService.getTags(),
      KMSService.getAllUsers()
    ]).then(([c, s, t, u]) => {
      setCategories(c);
      setSpaces(s);
      setTags(t);
      setUsers(u);
      handleSearch();
    });
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    // Get Results
    const docs = await KMSService.getDocuments(filters);
    setResults(docs);
    
    // Get Suggestions
    const sugs = await KMSService.getSearchSuggestions(filters.query);
    setAiSuggestions(sugs);
    setIsSearching(false);
  };

  const handleCheckboxChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => {
        const list = prev[field] as string[];
        if (list.includes(value)) {
            return { ...prev, [field]: list.filter(item => item !== value) };
        } else {
            return { ...prev, [field]: [...list, value] };
        }
    });
  };

  // Debounce search effect for query typing
  useEffect(() => {
     const delayDebounceFn = setTimeout(() => {
       handleSearch();
     }, 500);
     return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <Search className="text-indigo-600" /> Tìm kiếm Tri thức
          </h1>
          
          {/* A. Search Bar */}
          <div className="relative w-full max-w-4xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input 
                 type="text"
                 className="block w-full pl-12 pr-4 py-4 rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                 placeholder="Nhập từ khóa hoặc câu hỏi tự nhiên (Ví dụ: Quy trình an toàn tháng 3...)"
                 value={filters.query}
                 onChange={(e) => setFilters({...filters, query: e.target.value})}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                 <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                 </Button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* B. Faceted Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase">Bộ lọc</h3>
              <button className="text-xs text-indigo-600 hover:underline" onClick={() => setFilters({query: '', categoryIds: [], spaceIds: [], tags: [], fileTypes: [], status: [], sortBy: 'relevance'})}>Xóa bộ lọc</button>
           </div>
           
           {/* Facet: Categories */}
           <div className="border-b pb-4">
              <button onClick={() => toggleFacet('cat')} className="flex w-full justify-between items-center text-sm font-medium text-gray-900 mb-2">
                 <span>Danh mục Tri thức</span>
                 {facetsOpen.cat ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {facetsOpen.cat && (
                 <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {categories.map(c => (
                       <label key={c.id} className="flex items-center text-sm text-gray-600 cursor-pointer">
                          <input 
                             type="checkbox" 
                             className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
                             checked={filters.categoryIds?.includes(c.id)}
                             onChange={() => handleCheckboxChange('categoryIds', c.id)}
                          />
                          {c.name}
                       </label>
                    ))}
                 </div>
              )}
           </div>

           {/* Facet: Spaces */}
           <div className="border-b pb-4">
              <button onClick={() => toggleFacet('space')} className="flex w-full justify-between items-center text-sm font-medium text-gray-900 mb-2">
                 <span>Không gian Tri thức</span>
                 {facetsOpen.space ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {facetsOpen.space && (
                 <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {spaces.map(s => (
                       <label key={s.id} className="flex items-center text-sm text-gray-600 cursor-pointer">
                          <input 
                             type="checkbox" 
                             className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
                             checked={filters.spaceIds?.includes(s.id)}
                             onChange={() => handleCheckboxChange('spaceIds', s.id)}
                          />
                          {s.name}
                       </label>
                    ))}
                 </div>
              )}
           </div>

           {/* Facet: Tags */}
           <div className="border-b pb-4">
              <button onClick={() => toggleFacet('tag')} className="flex w-full justify-between items-center text-sm font-medium text-gray-900 mb-2">
                 <span>Tag / Từ khóa</span>
                 {facetsOpen.tag ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {facetsOpen.tag && (
                 <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                       <span 
                          key={t} 
                          onClick={() => handleCheckboxChange('tags', t)}
                          className={`px-2 py-1 text-xs rounded-full cursor-pointer transition-colors ${filters.tags?.includes(t) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                       >
                          #{t}
                       </span>
                    ))}
                 </div>
              )}
           </div>

           {/* Facet: File Type */}
           <div className="border-b pb-4">
              <button onClick={() => toggleFacet('type')} className="flex w-full justify-between items-center text-sm font-medium text-gray-900 mb-2">
                 <span>Loại tài liệu</span>
                 {facetsOpen.type ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {facetsOpen.type && (
                 <div className="space-y-2">
                    {['pdf', 'docx', 'xlsx', 'pptx'].map(type => (
                       <label key={type} className="flex items-center text-sm text-gray-600 cursor-pointer uppercase">
                          <input 
                             type="checkbox" 
                             className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
                             checked={filters.fileTypes?.includes(type)}
                             onChange={() => handleCheckboxChange('fileTypes', type)}
                          />
                          {type}
                       </label>
                    ))}
                 </div>
              )}
           </div>

           {/* Facet: Date */}
           <div className="border-b pb-4">
              <button onClick={() => toggleFacet('date')} className="flex w-full justify-between items-center text-sm font-medium text-gray-900 mb-2">
                 <span>Thời gian</span>
                 {facetsOpen.date ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {facetsOpen.date && (
                 <div className="space-y-2">
                    <div>
                       <label className="text-xs text-gray-500">Từ ngày</label>
                       <input 
                          type="date" 
                          className="w-full border rounded text-sm p-1" 
                          value={filters.dateFrom || ''}
                          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-xs text-gray-500">Đến ngày</label>
                       <input 
                          type="date" 
                          className="w-full border rounded text-sm p-1" 
                          value={filters.dateTo || ''}
                          onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                       />
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* C. Result Area */}
        <div className="lg:col-span-3 space-y-6">
           {/* E. AI Suggestions */}
           {aiSuggestions.length > 0 && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-3">
                 <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5" />
                 <div>
                    <span className="font-bold text-sm text-indigo-900">Gợi ý từ AI:</span>
                    <ul className="mt-1 space-y-1">
                       {aiSuggestions.map((sug, idx) => (
                          <li key={idx} className="text-sm text-indigo-700 cursor-pointer hover:underline" onClick={() => setFilters({...filters, query: sug})}>
                             • {sug}
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           )}

           {/* D. Sort Bar */}
           <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-gray-500">Tìm thấy <strong>{results.length}</strong> kết quả</span>
              <div className="flex items-center gap-2">
                 <span className="text-sm text-gray-700">Sắp xếp:</span>
                 <select 
                    className="border-none bg-transparent text-sm font-medium text-indigo-600 focus:ring-0 cursor-pointer"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                 >
                    <option value="relevance">Phù hợp nhất (AI)</option>
                    <option value="newest">Mới nhất</option>
                    <option value="views">Xem nhiều nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                 </select>
              </div>
           </div>

           {/* C. Cards Results */}
           <div className="space-y-4">
              {results.map(doc => {
                 const cat = categories.find(c => c.id === doc.categoryId);
                 const space = spaces.find(s => s.id === doc.spaceId);
                 
                 return (
                    <div 
                       key={doc.id} 
                       className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
                       onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                       <div className="flex gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                             <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <FileText className="w-6 h-6" />
                             </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                             <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 mb-1">
                                   {doc.title}
                                </h3>
                                <StatusBadge status={doc.status} />
                             </div>
                             
                             {/* F. Highlight Logic (Mocked via logic, in real app uses ES highlights) */}
                             <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {filters.query ? (
                                   <span>
                                      {doc.description.split(new RegExp(`(${filters.query})`, 'gi')).map((part, i) => 
                                         part.toLowerCase() === filters.query.toLowerCase() ? <span key={i} className="bg-yellow-200 font-bold">{part}</span> : part
                                      )}
                                   </span>
                                ) : doc.description}
                             </p>

                             {/* Metadata Badges */}
                             <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                   <Folder className="w-3 h-3" />
                                   <span className="font-medium text-gray-700">{cat?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                   <Layers className="w-3 h-3" />
                                   <span className="font-medium text-gray-700">{space?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                   <UserIcon className="w-3 h-3" />
                                   <span>{doc.createdBy.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                   <Calendar className="w-3 h-3" />
                                   <span>{doc.createdAt}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                   <Globe className="w-3 h-3" />
                                   <span>{doc.source || 'Hệ thống'}</span>
                                </div>
                             </div>

                             {/* Tags */}
                             <div className="flex flex-wrap gap-2">
                                {doc.tags.map(t => (
                                   <span key={t} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                      #{t}
                                   </span>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 );
              })}

              {results.length === 0 && !isSearching && (
                 <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Không tìm thấy tài liệu phù hợp.</p>
                    <p className="text-sm text-gray-400">Hãy thử từ khóa khác hoặc xóa bộ lọc.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
