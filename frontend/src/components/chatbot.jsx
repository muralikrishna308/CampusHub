// EventHubChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';

// 1. DATA STRUCTURES
// Updated qaList for CampusEventHub - Inter-College Event Management Platform

const qaList = [
  // Authentication & User Management (Module A)
  { 
    category: 'Account',
    icon: '🔐',
    question: 'How do I create an account?', 
    answer: 'Click "Register" on the login page. Choose your role (student or college admin), fill in your details including college name, and create a password. You\'ll receive a verification email to activate your account.' 
  },
  { 
    category: 'Account',
    icon: '🔄',
    question: 'What are the different user roles?', 
    answer: 'CampusEventHub has three roles: Students (can browse and register for events), College Admins (can create and manage events for their college), and Super Admins (platform-wide management).' 
  },

  // Event Listing & Registration (Module B)
  { 
    category: 'Events',
    icon: '📋',
    question: 'How do I browse upcoming events?', 
    answer: 'Visit the Events page where you can filter events by date, category (sports, hackathon, cultural, workshop), or college. Use the search bar to find specific events.' 
  },
  { 
    category: 'Events',
    icon: '📝',
    question: 'How do I register for an event?', 
    answer: 'Find your desired event on the Events page, click "View Details", then select "Register Now". You\'ll receive a confirmation email with event details.' 
  },
  { 
    category: 'Events',
    icon: '📌',
    question: 'Can I see which events I\'ve registered for?', 
    answer: 'Yes! Go to your Dashboard and click "My Events". You\'ll see all your registered events with their status (pending, approved, or rejected).' 
  },
  { 
    category: 'Events',
    icon: '🏷️',
    question: 'What types of events are available?', 
    answer: 'Events are categorized into sports competitions, hackathons, cultural fests, workshops, and more. You can filter by category on the Events page.' 
  },

  // Event Management Dashboard (Module C) - For Admins
  { 
    category: 'Management',
    icon: '📅',
    question: 'How do I create a new event? (For College Admins)', 
    answer: 'From your College Admin Dashboard, click "Create Event". Fill in the title, description, category, location, start/end dates, and any other details. Submit for listing.' 
  },
  { 
    category: 'Management',
    icon: '✏️',
    question: 'How do I edit or cancel an existing event?', 
    answer: 'College Admins can go to their Dashboard, find the event in "My Events", and click "Edit" to update details or "Cancel" to remove the listing. Changes are reflected immediately.' 
  },
  { 
    category: 'Management',
    icon: '👥',
    question: 'How do I manage student registrations?', 
    answer: 'Admins can view all registrations in the Dashboard. Use the status dropdown to approve or reject registrations. Approved students receive email notifications.' 
  },

  // Community Feedback & Interaction (Module D)
  { 
    category: 'Feedback',
    icon: '⭐',
    question: 'How do I rate an event I attended?', 
    answer: 'After an event ends, go to the event page and scroll to the Feedback section. Rate the event on a numeric scale and leave comments about your experience.' 
  },
  { 
    category: 'Feedback',
    icon: '💬',
    question: 'Can I discuss events with other students?', 
    answer: 'Yes! Each event has a discussion section where registered students can post comments, ask questions, and interact with other participants.' 
  },
  { 
    category: 'Feedback',
    icon: '📊',
    question: 'How do admins see event feedback?', 
    answer: 'College Admins have access to a Feedback Analysis Dashboard showing average ratings, comment summaries, and trends for each event to improve future planning.' 
  },

  // General Platform Questions
  { 
    category: 'General',
    icon: '🏛️',
    question: 'Can students from different colleges participate?', 
    answer: 'Absolutely! CampusEventHub is designed for inter-college participation. You can browse and register for events hosted by any college on the platform.' 
  },
  { 
    category: 'General',
    icon: '🔔',
    question: 'Will I get reminders about events?', 
    answer: 'Yes, you\'ll receive email reminders 24 hours before events you\'re registered for. You can also enable push notifications in your account settings.' 
  },
  { 
    category: 'General',
    icon: '❓',
    question: 'Who do I contact for technical issues?', 
    answer: 'For platform-related issues, contact super_admin@campuseventhub.com. For event-specific questions, use the discussion section or contact the hosting college admin.' 
  },
  { 
    category: 'General',
    icon: '📱',
    question: 'Is there a mobile app available?', 
    answer: 'CampusEventHub is a responsive web platform that works seamlessly on mobile browsers. A dedicated mobile app is planned for future releases.' 
  },

  // Registration Status Questions
  { 
    category: 'Registration',
    icon: '⏳',
    question: 'What does "pending" registration status mean?', 
    answer: 'Pending means the college admin hasn\'t reviewed your registration yet. They\'ll approve or reject it based on event capacity and eligibility. This usually takes 1-2 days.' 
  },
  { 
    category: 'Registration',
    icon: '✅',
    question: 'Can I cancel my registration after approval?', 
    answer: 'Yes, go to "My Events" and click "Cancel Registration". Cancellation is free up to 48 hours before the event. Late cancellations may affect future registrations.' 
  },
  { 
    category: 'Registration',
    icon: '❌',
    question: 'Why was my registration rejected?', 
    answer: 'Registrations may be rejected due to capacity limits, eligibility requirements, or if you\'ve missed the deadline. Contact the event organizer through the discussion section for details.' 
  }
];


const welcomeMessage = {
  sender: 'bot',
  text: 'Welcome to EventHub. I\'m your assistant. How may I help you today?'
};

export default function EventHubChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const messagesEndRef = useRef(null);
  const [hoveredQuestion, setHoveredQuestion] = useState(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuestionClick = (qa) => {
    setMessages(prev => [...prev, { sender: 'user', text: qa.question }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: qa.answer }]);
    }, 800);
  };

  const categories = ['all', ...new Set(qaList.map(qa => qa.category))];
  const filteredQuestions = selectedCategory === 'all' 
    ? qaList 
    : qaList.filter(qa => qa.category === selectedCategory);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '30px', 
      right: '30px', 
      zIndex: 9999, 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
    }}>
      
      {/* TRIGGER ICON - Theme Purple Gradient */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '24px',
            width: '60px',
            height: '60px',
            fontSize: '1.6rem',
            cursor: 'pointer',
            boxShadow: '0 15px 30px -10px rgba(124, 58, 237, 0.4)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 20px 35px -8px rgba(124, 58, 237, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(124, 58, 237, 0.4)';
          }}
        >
          <span>💬</span>
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '10px',
            height: '10px',
            background: '#10b981',
            borderRadius: '50%',
            border: '2px solid #ffffff',
          }} />
        </button>
      )}

      {/* CHAT PANEL */}
      {open && (
        <div style={{
          width: '380px',
          height: '580px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease',
        }}>
          
          {/* Header - Theme Purple Gradient */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#ffffff',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>✨</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>EventHub Assistant</h2>
                  <p style={{ margin: '2px 0 0', fontSize: '0.7rem', opacity: 0.8 }}>Online • Instant reply</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#fff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages Area with Theme Colors */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Assistant Avatar (Left) */}
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
                  }}>
                    A
                  </div>
                )}

                <div style={{
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
                    : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' 
                    ? '16px 16px 4px 16px' 
                    : '16px 16px 16px 4px',
                  maxWidth: '70%',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  boxShadow: msg.sender === 'user' 
                    ? '0 4px 12px rgba(79, 70, 229, 0.25)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.02)',
                  border: msg.sender === 'bot' ? '1px solid #ede9fe' : 'none',
                }}>
                  {msg.text}
                </div>

                {/* User Avatar (Right) */}
                {msg.sender === 'user' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(199, 210, 254, 0.5)',
                  }}>
                    U
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator with Theme Colors */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}>
                  A
                </div>
                <div style={{
                  background: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  border: '1px solid #ede9fe',
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#4f46e5', borderRadius: '50%', animation: 'bounce 1.4s infinite' }} />
                    <span style={{ width: '6px', height: '6px', background: '#7c3aed', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '0.2s' }} />
                    <span style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Panel */}
          <div style={{
            padding: '16px',
            background: '#ffffff',
            borderTop: '1px solid #ede9fe',
          }}>
            {/* Category Pills - Theme Colors */}
            <div style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '12px',
              overflowX: 'auto',
              paddingBottom: '2px',
            }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '30px',
                    border: 'none',
                    background: selectedCategory === cat 
                      ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
                      : '#f5f3ff',
                    color: selectedCategory === cat ? '#ffffff' : '#4f46e5',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    boxShadow: selectedCategory === cat ? '0 4px 10px rgba(79, 70, 229, 0.25)' : 'none',
                  }}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* Questions List - Border Only on Hover */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxHeight: '130px',
              overflowY: 'auto',
            }}>
              {filteredQuestions.map((qa, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(qa)}
                  onMouseEnter={() => setHoveredQuestion(idx)}
                  onMouseLeave={() => setHoveredQuestion(null)}
                  style={{
                    background: '#ffffff',
                    border: hoveredQuestion === idx 
                      ? '2px solid #7c3aed' 
                      : '1px solid #ede9fe',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#4b5563',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: hoveredQuestion === idx ? '0 2px 8px rgba(124, 58, 237, 0.1)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '0.95rem' }}>{qa.icon}</span>
                  <span style={{ flex: 1 }}>{qa.question}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: #f5f3ff; }
        div::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 10px; }
      `}</style>
    </div>
  );
}