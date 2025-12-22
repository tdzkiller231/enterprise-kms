import React, { useState, useEffect, useRef } from 'react';
import { KMSDocument, Comment, User, SpaceRole } from '../types';
import { KMSService } from '../services/kmsService';
import { Button } from './UI';
import { 
  X, 
  Send, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Reply,
  FileText,
  User as UserIcon,
  Clock,
  MessageSquare
} from 'lucide-react';

interface DocumentThreadProps {
  document: KMSDocument;
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: SpaceRole;
  currentUserId?: string;
}

export const DocumentThread: React.FC<DocumentThreadProps> = ({
  document,
  isOpen,
  onClose,
  currentUserRole = 'Viewer',
  currentUserId = 'u1'
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && document.id) {
      loadComments();
    }
  }, [isOpen, document.id]);

  const loadComments = async () => {
    const docComments = await KMSService.getDocumentComments(document.id);
    setComments(docComments);
  };

  const canComment = ['Contributor', 'Moderator', 'Owner'].includes(currentUserRole);
  const canModerate = ['Moderator', 'Owner'].includes(currentUserRole);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !canComment) return;

    const comment: Partial<Comment> = {
      content: newComment,
      docId: document.id,
      docTitle: document.title,
      parentId: replyingTo,
      mentions: extractMentions(newComment)
    };

    await KMSService.addComment(comment);
    setNewComment('');
    setReplyingTo(null);
    loadComments();
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    await KMSService.updateComment(commentId, {
      content: editContent,
      mentions: extractMentions(editContent)
    });
    setEditingComment(null);
    setEditContent('');
    loadComments();
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      await KMSService.deleteComment(commentId);
      loadComments();
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  };

  const canEditComment = (comment: Comment) => {
    return comment.user.id === currentUserId;
  };

  const canDeleteComment = (comment: Comment) => {
    return comment.user.id === currentUserId || canModerate;
  };

  const buildCommentTree = (parentId: string | null = null): Comment[] => {
    return comments
      .filter(c => c.parentId === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => {
    const [showActions, setShowActions] = useState(false);
    const isEditing = editingComment === comment.id;
    const replies = buildCommentTree(comment.id);

    return (
      <div className={`${depth > 0 ? 'ml-8 mt-3 pl-4 border-l-2 border-gray-200' : 'mb-4'}`}>
        <div 
          className="group relative"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div className="flex gap-3">
            <img 
              src={comment.user.avatar} 
              alt={comment.user.name}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">{comment.user.name}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {comment.createdAt}
                  {comment.isEdited && <span className="italic">(đã chỉnh sửa)</span>}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                      Lưu
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {comment.content}
                </div>
              )}

              {!isEditing && (
                <div className="mt-2 flex items-center gap-3">
                  {canComment && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Reply className="w-3 h-3" />
                      Trả lời
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Actions Menu */}
            {showActions && !isEditing && (
              <div className="flex gap-1">
                {canEditComment(comment) && (
                  <button
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {canDeleteComment(comment) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-3">
              {replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 ml-11">
              <div className="flex gap-2">
                <textarea
                  ref={textareaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Trả lời ${comment.user.name}...`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={2}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleSubmitComment}>
                  <Send className="w-3 h-3 mr-1" />
                  Gửi
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => {
                    setReplyingTo(null);
                    setNewComment('');
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] lg:w-[600px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Thảo luận</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Document Info */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <div className="p-2 bg-indigo-50 rounded">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {document.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <UserIcon className="w-3 h-3" />
                <span>{document.createdBy.name}</span>
                <span>•</span>
                <span>v{document.versions[0].version}</span>
                <span>•</span>
                <span>{document.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {comments.length} bình luận
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {buildCommentTree().length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Chưa có bình luận nào</p>
              {canComment && (
                <p className="text-xs mt-1">Hãy là người đầu tiên thảo luận về tài liệu này</p>
              )}
            </div>
          ) : (
            buildCommentTree().map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>

        {/* New Comment Input */}
        {canComment && !replyingTo && (
          <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3">
              <img 
                src="https://picsum.photos/32/32?random=1" 
                alt="Current user"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận... (Shift+Enter để xuống dòng, @ để mention)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    Enter để gửi, Shift+Enter xuống dòng
                  </span>
                  <Button 
                    size="sm" 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Gửi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!canComment && (
          <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-yellow-50">
            <p className="text-sm text-yellow-800 text-center">
              Bạn cần quyền Contributor trở lên để tham gia thảo luận
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
