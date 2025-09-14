import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X,
  CloudRain,
  TrendingUp,
  Bug,
  Thermometer
} from 'lucide-react';

export interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  onNotificationCount: (count: number) => void;
}

const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'warning',
    title: '날씨 경보',
    message: '내일 오후부터 강한 비가 예상됩니다. 노지 작물 보호 조치를 준비하세요.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2분 전
    icon: '🌧️'
  },
  {
    id: '2',
    type: 'info',
    title: '시세 정보',
    message: '고추 가격이 5% 상승했습니다. 판매 타이밍을 고려해보세요.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
    icon: '📈'
  },
  {
    id: '3',
    type: 'warning',
    title: '병해충 경보',
    message: '토마토 잎마름병 발생이 지역적으로 증가하고 있습니다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
    icon: '🐛'
  }
];

export function NotificationCenter({ onNotificationCount }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>(mockNotifications);

  useEffect(() => {
    onNotificationCount(notifications.length);
  }, [notifications, onNotificationCount]);

  // 실시간 알림 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% 확률로 새 알림 생성
      if (Math.random() < 0.3) {
        const newNotifications = [
          {
            id: Date.now().toString(),
            type: 'info' as const,
            title: '온도 알림',
            message: '오늘 최고 기온이 30도를 넘을 예정입니다. 충분한 관수를 해주세요.',
            timestamp: new Date(),
            icon: '🌡️'
          },
          {
            id: Date.now().toString(),
            type: 'success' as const,
            title: '진단 완료',
            message: 'AI 진단이 완료되었습니다. 결과를 확인해보세요.',
            timestamp: new Date(),
            icon: '✅'
          },
          {
            id: Date.now().toString(),
            type: 'warning' as const,
            title: '습도 주의',
            message: '습도가 80%를 넘어 병해 발생 위험이 높습니다.',
            timestamp: new Date(),
            icon: '💧'
          }
        ];

        const randomNotification = newNotifications[Math.floor(Math.random() * newNotifications.length)];
        
        setNotifications(prev => [randomNotification, ...prev].slice(0, 10)); // 최대 10개 유지

        // Toast 알림 표시
        showToast(randomNotification);
      }
    }, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, []);

  const showToast = (notification: NotificationData) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'success': return <CheckCircle className="w-5 h-5" />;
        case 'warning': return <AlertTriangle className="w-5 h-5" />;
        case 'error': return <X className="w-5 h-5" />;
        default: return <Info className="w-5 h-5" />;
      }
    };

    toast(notification.title, {
      description: notification.message,
      icon: getIcon(),
      duration: 5000,
      action: notification.action ? {
        label: notification.action.label,
        onClick: notification.action.onClick
      } : undefined
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.success('모든 알림이 삭제되었습니다.');
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <X className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // 시스템 알림 표시 함수들
  const showWeatherAlert = () => {
    const notification: NotificationData = {
      id: Date.now().toString(),
      type: 'warning',
      title: '기상 특보',
      message: '강풍 주의보가 발효되었습니다. 시설물 점검을 해주세요.',
      timestamp: new Date(),
      icon: '💨'
    };
    setNotifications(prev => [notification, ...prev]);
    showToast(notification);
  };

  const showPriceAlert = () => {
    const notification: NotificationData = {
      id: Date.now().toString(),
      type: 'info',
      title: '가격 변동',
      message: '배추 가격이 10% 하락했습니다.',
      timestamp: new Date(),
      icon: '📉'
    };
    setNotifications(prev => [notification, ...prev]);
    showToast(notification);
  };

  // 외부에서 호출할 수 있는 함수들 노출
  (window as any).showWeatherAlert = showWeatherAlert;
  (window as any).showPriceAlert = showPriceAlert;
  (window as any).clearNotifications = clearNotifications;

  return (
    <div className="notification-center">
      {/* 실제 알림은 Sonner의 Toaster 컴포넌트에서 처리됨 */}
      {/* 여기서는 알림 데이터를 관리하고 카운트를 제공 */}
    </div>
  );
}