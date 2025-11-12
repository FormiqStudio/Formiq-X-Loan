'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search,
  MessageSquare,
  Users,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Plus
} from 'lucide-react';
import { useGetChatsQuery, useGetApplicationsQuery, useCreateChatMutation } from '@/store/api/apiSlice';
import { SkeletonCard } from '@/components/ui/loading/SkeletonCard';
import ChatWindow from '@/components/chat/ChatWindow';
import { toast } from 'sonner';

function ChatPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams?.get('applicationId');

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(applicationId || null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch user's chats
  const {
    data: chatsData,
    isLoading: isLoadingChats,
    error: chatsError,
    refetch: refetchChats
  } = useGetChatsQuery({ userId: session?.user?.id || '' }, {
    skip: !session?.user?.id
  });

  // Fetch user's applications (for creating new chats)
  const {
    data: applicationsData,
    isLoading: isLoadingApplications
  } = useGetApplicationsQuery({
    userId: session?.user?.id || '',
    status: 'partially_approved'
  }, {
    skip: !session?.user?.id
  });

  const [createChat] = useCreateChatMutation();

  // Auto-select chat if applicationId is provided
  useEffect(() => {
    if (applicationId && chatsData?.chats && chatsData.chats.length > 0) {
      const chat = chatsData.chats.find(c => c.applicationId === applicationId);
      if (chat) {
        setSelectedChat(chat._id);
      }
    }
  }, [applicationId, chatsData?.chats]);

  // Redirect if not authenticated
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user || session.user.role !== 'user') {
    router.push('/login');
    return null;
  }

  const chats = chatsData?.chats || [];
  const applications = applicationsData?.applications || [];

  const handleCreateChat = async (appId: string, dsaIds: string[]) => {
    try {
      const result = await createChat({
        applicationId: appId,
        participants: [session.user.id, ...dsaIds]
      }).unwrap();
      
      setSelectedChat(result.chat._id);
      refetchChats();
      toast.success('Chat created successfully');
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to create chat');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'partially_approved': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getOnlineStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const safeTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Filter chats based on search
  const filteredChats = chats.filter((chat: any) => {
    const appId = typeof chat.applicationId === 'string'
      ? chat.applicationId
      : (chat.applicationId as any)?._id || '';
    
    const participantNames = chat.participants
      .filter((p: any) => p.userId !== session.user.id)
      .map((p: any) => p.name.toLowerCase())
      .join(' ');

    return appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           participantNames.includes(searchTerm.toLowerCase());
  });

  const selectedChatData = filteredChats.find(chat => chat._id === selectedChat);

  if (chatsError) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Chats</h3>
            <p className="text-slate-600 mb-4">Failed to load your chats. Please try again.</p>
            <Button onClick={() => refetchChats()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(80vh-2rem)] flex bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className={`${selectedChat ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r border-slate-200 flex-col`}>
          <div className="p-3 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
              {selectedChat && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSelectedChat(null)}
                >
                  Back
                </Button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {isLoadingChats ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm">No conversations found</p>
                  <p className="text-xs mt-1">Start chatting with DSAs for your approved applications</p>
                  
                  {!isLoadingApplications && applications.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium text-slate-700">Available Applications:</p>
                      {applications.slice(0, 3).map((app: any) => (
                        <div key={app._id} className="text-left p-2 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium">#{app.applicationId}</p>
                              <p className="text-xs text-slate-600">{app.educationInfo?.course || 'N/A'}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                if (app.assignedDSAs && app.assignedDSAs.length > 0) {
                                  handleCreateChat(app._id, app.assignedDSAs.map((dsa: any) => dsa.userId));
                                }
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat._id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 ${
                      chat._id === selectedChat ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {chat.participants.length > 2 ? (
                              <Users className="h-5 w-5" />
                            ) : (
                              getInitials(
                                chat.participants
                                  .filter((p: any) => p.userId !== session.user.id)[0]?.name || 'U'
                              )
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getOnlineStatusColor('offline')}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-slate-900 truncate">
                            Application #{(() => {
                              if (typeof chat.applicationId === 'string') {
                                return chat.applicationId.slice(-6);
                              }
                              if (chat.applicationId && typeof chat.applicationId === 'object' && (chat.applicationId as any)._id) {
                                return (chat.applicationId as any)._id.slice(-6);
                              }
                              return 'N/A';
                            })()}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {chat.lastMessage && safeTimeAgo(chat.lastMessage.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600 truncate">
                            {chat.lastMessage 
                              ? `${chat.lastMessage.senderName}: ${chat.lastMessage.message}`
                              : 'No messages yet'
                            }
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-blue-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-1">
                            {chat.participants
                              .filter((p: any) => p.userId !== session.user.id)
                              .slice(0, 2)
                              .map((participant: any, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {participant.name}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`${selectedChat ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
          {selectedChat && selectedChatData ? (
            <div className="h-full w-full">
              <ChatWindow
                chatId={selectedChat}
                applicationId={
                  typeof selectedChatData.applicationId === 'string'
                    ? selectedChatData.applicationId
                    : (selectedChatData.applicationId as any)?._id || ''
                }
                participants={selectedChatData.participants}
                onClose={() => setSelectedChat(null)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the sidebar to start messaging with your DSAs</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function UserChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}