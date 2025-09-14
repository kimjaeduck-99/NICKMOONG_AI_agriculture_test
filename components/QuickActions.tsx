import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Camera, 
  TrendingUp, 
  Cloud, 
  Calendar,
  MapPin,
  Phone,
  BookOpen,
  AlertTriangle,
  Smartphone,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const quickActions = [
  {
    id: 'camera',
    label: '사진 진단',
    description: '병충해 진단',
    icon: Camera,
    color: 'bg-blue-500 hover:bg-blue-600',
    textColor: 'text-blue-600'
  },
  {
    id: 'prices',
    label: '시세 확인',
    description: '실시간 농산물 시세',
    icon: TrendingUp,
    color: 'bg-green-500 hover:bg-green-600',
    textColor: 'text-green-600'
  },
  {
    id: 'weather',
    label: '날씨 정보',
    description: '농업 기상 정보',
    icon: Cloud,
    color: 'bg-purple-500 hover:bg-purple-600',
    textColor: 'text-purple-600'
  },
  {
    id: 'calendar',
    label: '농업 달력',
    description: '농사 일정 관리',
    icon: Calendar,
    color: 'bg-orange-500 hover:bg-orange-600',
    textColor: 'text-orange-600'
  },
  {
    id: 'location',
    label: '지역 정보',
    description: '지역별 농업 정보',
    icon: MapPin,
    color: 'bg-red-500 hover:bg-red-600',
    textColor: 'text-red-600'
  },
  {
    id: 'contact',
    label: '전문가 상담',
    description: '농업 기술센터 연결',
    icon: Phone,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    textColor: 'text-indigo-600'
  },
  {
    id: 'map',
    label: '병충해 지도',
    description: '지역별 발생 현황',
    icon: MapPin,
    color: 'bg-rose-500 hover:bg-rose-600',
    textColor: 'text-rose-600'
  }
];

const appFeatures = [
  {
    id: 'offline',
    label: '오프라인 모드',
    description: '인터넷 없이도 기본 기능 사용',
    icon: Smartphone
  },
  {
    id: 'install',
    label: '앱 설치',
    description: '홈 화면에 추가하여 앱처럼 사용',
    icon: Download
  },
  {
    id: 'emergency',
    label: '긴급 알림',
    description: '병해충 경보 및 기상 특보',
    icon: AlertTriangle
  },
  {
    id: 'guide',
    label: '사용 가이드',
    description: '농업 AI 시스템 사용법',
    icon: BookOpen
  }
];

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            ⚡ 빠른 기능
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => onActionClick(action.id)}
                    className="h-auto p-4 flex flex-col items-center gap-2 w-full border-2 hover:border-current transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">{action.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* PWA Features */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            📱 앱 기능
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {appFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onActionClick(feature.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200 hover:shadow-sm"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{feature.label}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Installation Prompt */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 mb-2">
                농업 AI 앱으로 설치하기
              </h3>
              <p className="text-sm text-green-700 mb-4">
                홈 화면에 추가하여 네이티브 앱처럼 사용하세요. 오프라인에서도 기본 기능을 이용할 수 있습니다.
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onActionClick('install-app')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  설치하기
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onActionClick('learn-more')}
                >
                  자세히 보기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}